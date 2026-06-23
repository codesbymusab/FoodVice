import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useParams } from "react-router";
import { createReview } from "../../../apis/reviews";
import { validateReviewForm, hasErrors } from "../../../utils/validators";
import { ConfirmationDialog, OperationLoadingDialog } from "../../Shared/Feedback";
import StarRating from "./StarRating";

export function AddReviewForm({ setShowReviewForm, fetchRestaurant, location }: { setShowReviewForm: React.Dispatch<React.SetStateAction<boolean>>, fetchRestaurant: (location: [number, number] | null) => Promise<void>, location: [number, number] | null }) {
  const [food, setFood] = useState(0);
  const [service, setService] = useState(0);
  const [ambience, setAmbience] = useState(0);
  const [price, setPrice] = useState(0);
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { user } = useAuth()
  const params = useParams()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate form
    const validationErrors = validateReviewForm(text, food, service, ambience, price)
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors)
      return
    }

    // Show confirmation dialog
    setShowConfirmation(true)
  }

  async function confirmSubmit() {
    setLoading(true);
    setShowConfirmation(false);

    try {
      const formData = new FormData();
      formData.append("userId", `${user?.userId}`);
      formData.append("restaurantId", `${params.id}`);
      formData.append("text", text);
      formData.append("rating", JSON.stringify({ food, service, ambience, price}));

      files.forEach(file => formData.append("files", file));

      await createReview(formData);
      await fetchRestaurant(location);

      setShowReviewForm(false);
    } catch (err) {
      console.error(err);
      setErrors({
        submit: err instanceof Error ? err.message : "Failed to submit review. Please try again."
      })
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {showConfirmation && (
        <ConfirmationDialog
          title="Submit Review?"
          message={`You're about to submit a review with ratings:\n• Food: ${food}/5\n• Service: ${service}/5\n• Ambience: ${ambience}/5\n• Price: ${price}/5`}
          confirmText="Post Review"
          cancelText="Cancel"
          onConfirm={confirmSubmit}
          onCancel={() => setShowConfirmation(false)}
          isLoading={loading}
        />
      )}

      {loading && <OperationLoadingDialog message="Posting your review..." />}

      <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-outline/50">
        <form className="space-y-12" onSubmit={handleSubmit}>

          {/* Error alert */}
          {errors.submit && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-600 dark:text-red-400">error</span>
                <p className="text-sm text-red-700 dark:text-red-300">{errors.submit}</p>
              </div>
            </div>
          )}

          {/* Ratings UI (replace stars with interactive handlers) */}
          {/* Example: */}
          <div>
            <label className="block text-sm font-semibold mb-2">Food Quality</label>
            <StarRating value={food} onChange={setFood} disabled={loading} />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Service</label>
            <StarRating value={service} onChange={setService} disabled={loading} />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Ambience</label>
            <StarRating value={ambience} onChange={setAmbience} disabled={loading} />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Value for Money</label>
            <StarRating value={price} onChange={setPrice} disabled={loading} />
          </div>


          {/* Review text */}
          <div>
            <label className="block text-sm font-semibold mb-2">Review
              {errors.text && <span className="text-red-600 ml-2 text-xs">{errors.text}</span>}
            </label>
            <textarea
              value={text}
              onChange={e => { setText(e.target.value); if (errors.text) setErrors({ ...errors, text: "" }) }}
              placeholder="Describe your dining experience..."
              rows={6}
              className={`w-full rounded-2xl border p-4 ${errors.text ? 'border-red-500' : 'border-gray-300'}`}
              disabled={loading}
            />
          </div>

          {/* File upload */}
          <div>
            <label className="block text-sm font-semibold mb-2">Upload Photos (Optional)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={e => setFiles(Array.from(e.target.files || []))}
              disabled={loading}
            />
            {files.length > 0 && <p className="text-sm text-gray-600 mt-2">{files.length} file(s) selected</p>}
          </div>

          {/* Buttons */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-primary text-white font-black uppercase tracking-widest text-xs shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
            <button
              type="button"
              className="w-full py-4 rounded-xl border-2 border-stone-100 text-stone-500 font-black uppercase tracking-widest text-xs hover:bg-red-200/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setShowReviewForm(false)}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
