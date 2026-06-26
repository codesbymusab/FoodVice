import { useState, useEffect } from "react";
import { ReviewCard } from "../Cards/ReviewCard";
import { ErrorScreen, SkeletonList } from "../../../Shared/Feedback";
import { fetchRecentReviews, type Review } from "../../../../apis/reviews";
import { useAuth } from "../../../../context/AuthContext";
import type { cursorPagination } from "../../../../apis/restaurants";

export function Reviews() {

    const [reviews, setReviews] = useState<Review[]>([])
    const [reviewsPagination, setReviewsPagination] = useState<cursorPagination | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const { user } = useAuth()
    const loadReviews = async () => {
        if (!user) return;
        setLoading(true)
        setError(null)
        try {
            const result = await fetchRecentReviews({ userId: user!.userId, limit: 3, cursor: reviewsPagination?.cursor });
           
            if (result && result.data.length > 0) {
                if (reviewsPagination?.cursor) {
                    setReviews([...reviews!, ...result.data]);
                }
                else {
                    setReviews(result?.data ?? null)
                }
                setReviewsPagination(result?.pagination ?? null)
            }


        } catch (error) {
            console.error(error);
            setError("Unable to load recent reviews. Please try again.");
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        if (!user) return;
        loadReviews()
    }, [user])


    return (
        <section className="px-4">
            <h3 className="text-2xl font-bold mb-8">Recent Reviews</h3>
            <div className="max-w-2xl mx-auto space-y-8">

                {
                    loading ? (
                        <SkeletonList count={3} />
                    ) : error ? (
                        <ErrorScreen title="Unable to load reviews" message={error} onRetry={loadReviews} />
                    ) : reviews && reviews.length > 0 ? (
                        reviews.map((review) => {
                            return <ReviewCard key={review._id} review={review} setReviews={setReviews} />
                        })
                    ) : (
                        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                            No reviews are available at the moment.
                        </div>
                    )

                }


            </div>
            {reviewsPagination?.hasMore && <div className='mt-4 flex items-center justify-center'>
                <button className="px-4 py-3  mb-4 border-2 bg-white rounded-2xl border-primary text-primary font-bold text-sm hover:underline hover:scale-105" onClick={async () => loadReviews()}>
                    View More
                </button>
            </div>}
        </section>
    )
}