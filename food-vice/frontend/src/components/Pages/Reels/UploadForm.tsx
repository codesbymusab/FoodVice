import React, { useState } from "react";
import { validateReelUploadForm, hasErrors } from "../../../utils/validators";
import { ConfirmationDialog, ErrorScreen, OperationLoadingDialog } from "../../Shared/Feedback";

export function UploadReelForm({ onSubmit, setShowReelForm }: {
  onSubmit: (formData: FormData) => void,
  setShowReelForm: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const [newTag, setNewTag] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateReelUploadForm(title, description, video)
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors)
      return
    }

    // Show confirmation dialog
    setShowConfirmation(true)
  };

  const confirmSubmit = () => {
    if (!video) return alert("Please upload a video");

    setIsSubmitting(true)
    setShowConfirmation(false)

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", video);
    formData.append("tags", JSON.stringify(tags));

    try {
      onSubmit(formData);
    } catch (err) {
     
      setErrors({
        submit: err instanceof Error ? err.message : "Failed to upload reel. Please try again."
      })
      
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleVideoChange(file: File | null) {
    setVideo(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
      if (errors.video) {
        setErrors({...errors, video: ""})
      }
    } else {
      setVideoPreview(null);
    }
  };

  if(errors.submit){
    return <ErrorScreen title="Upload Failed" message={errors.submit} onRetry={confirmSubmit}/>
  }
  return (
    <>
      {showConfirmation && (
        <ConfirmationDialog
          title="Upload Reel?"
          message={`You're about to upload a reel titled "${title}" with ${tags.length} tag(s).`}
          confirmText="Upload Reel"
          cancelText="Cancel"
          onConfirm={confirmSubmit}
          onCancel={() => setShowConfirmation(false)}
          isLoading={isSubmitting}
        />
      )}

      {isSubmitting && <OperationLoadingDialog message="Uploading your reel..." />}

      <div className="bg-white my-6 mx-auto w-2/4 g-white rounded-2xl p-8 md:p-12 shadow-sm border border-outline/50">
        <div className="mb-10">
          <h2 className="text-xl font-black text-tertiary mb-2 font-headline tracking-tight uppercase">
            Upload a Reel
          </h2>
          <p className="text-on-surface-variant">
            Share your creative video content with the community.
          </p>
        </div>

        {errors.submit && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-red-600 dark:text-red-400">error</span>
              <p className="text-sm text-red-700 dark:text-red-300">{errors.submit}</p>
            </div>
          </div>
        )}

        <form className="space-y-12" onSubmit={handleSubmit}>

          <div className="flex flex-col gap-8 bg-surface-container-low p-2 rounded-2xl">
            <div className="space-y-3">
              <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant">
                Title
                {errors.title && <span className="text-red-600 ml-2">{errors.title}</span>}
              </label>
              <input
                type="text"
                value={title}
                onChange={e => {setTitle(e.target.value); if (errors.title) setErrors({...errors, title: ""})}}
                className={`w-full rounded-xl ring-2 bg-slate-100 p-4 text-on-surface focus:border-primary focus:ring-4 focus:ring-primary/35 transition-all outline-none font-body border-outline ${
                  errors.title ? 'border-red-500 ring-red-300' : 'ring-gray-200'
                }`}
                placeholder="Enter reel title"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant">
                Description
                {errors.description && <span className="text-red-600 ml-2">{errors.description}</span>}
              </label>
              <textarea
                value={description}
                onChange={e => {setDescription(e.target.value); if (errors.description) setErrors({...errors, description: ""})}}
                className={`w-full rounded-xl ring-2 bg-slate-100 p-4 text-on-surface focus:border-primary focus:ring-4 focus:ring-primary/35 transition-all outline-none font-body resize-none border-outline ${
                  errors.description ? 'border-red-500 ring-red-300' : 'ring-gray-200'
                }`}
                placeholder="Describe your reel..."
                rows={4}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {videoPreview ? (
            <div className="w-full  mt-4">
              <video
                src={videoPreview}
                controls
                className="rounded-xl shadow-md"
              />
              <button
                type="button"
                onClick={() => handleVideoChange(null)}
                className="mt-3 w-full py-2 px-4 rounded-lg bg-red-100 text-red-700 font-semibold text-sm hover:bg-red-200 transition-all"
                disabled={isSubmitting}
              >
                Change Video
              </button>
            </div>)
            
            :
            <div className="space-y-4">
              <label className="block text-sm font-black uppercase tracking-widest text-tertiary">
                Upload Video
                {errors.video && <span className="text-red-600 ml-2">{errors.video}</span>}
              </label>
              <div className={`border-4 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center bg-slate-100 hover:border-primary/50 hover:bg-surface-container-low transition-colors cursor-pointer group ${
                errors.video ? 'border-red-400' : 'border-outline-variant'
              }`}>
                <input
                  type="file"
                  accept="video/*"
                  onChange={e => handleVideoChange(e.target.files?.[0] || null)}
                  className="hidden"
                  id="video-upload"
                  disabled={isSubmitting}
                />
                <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center w-full">
                  <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-secondary text-4xl">
                      video_file
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-tertiary mb-1">Drag and drop your video</h4>
                  <p className="text-on-surface-variant text-sm mb-6">Or click to browse from your device</p>
                  <div className="flex gap-4">
                    <div className="bg-surface-container-high px-4 py-2 rounded-full text-xs font-bold text-on-surface-variant">MP4, WebM</div>
                    <div className="bg-surface-container-high px-4 py-2 rounded-full text-xs font-bold text-on-surface-variant">Max 50MB</div>
                  </div>
                </label>
              </div>
            </div>
          }

          <div className="space-y-4">
            <label className="block text-sm font-black uppercase tracking-widest text-tertiary">
              Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                className="flex-1 rounded-xl ring-2 ring-gray-200 p-4 text-on-surface focus:border-primary focus:ring-4 focus:ring-primary/35 transition-all outline-none font-body bg-slate-100 border-outline"
                placeholder="Add a tag"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => {
                  if (newTag.trim()) {
                    setTags([...tags, newTag.trim()]);
                    setNewTag("");
                  }
                }}
                className="px-6 py-3 rounded-xl bg-primary text-white font-bold uppercase tracking-widest text-xs shadow-md hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <div key={i} className="bg-surface-container-high px-4 py-2 rounded-full text-xs font-bold text-on-surface-variant flex items-center gap-2">
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => setTags(tags.filter((_, index) => index !== i))}
                    className="hover:text-red-600 transition-colors"
                    disabled={isSubmitting}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>


          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-primary text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Uploading..." : "Upload Reel"}
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl border-2 border-stone-100 text-stone-500 font-black uppercase tracking-widest text-xs hover:bg-red-200/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setShowReelForm(prev => !prev)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
