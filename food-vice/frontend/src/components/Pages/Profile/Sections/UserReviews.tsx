import { useAuth } from "../../../../context/AuthContext";
import { toggleLikeReview as toggleLikeReviewApi, type Review } from "../../../../apis/reviews";
import { fetchUserReviews } from "../../../../apis/profile";
import type { cursorPagination } from "../../../../apis/restaurants";
import { useEffect, useState } from "react";

export function UserReviews({ userId }: { userId: string }) {

    const { user } = useAuth()
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewsPagination, setReviewsPagination] = useState<cursorPagination | null>(null)

    async function loadReviews() {
        const result = await fetchUserReviews(userId)
        if (result) {
            if (reviewsPagination?.cursor) {
                setReviews([...reviews, ...result.data])
            } else {
                setReviews(result.data)
            }
            setReviewsPagination(result.pagination ?? null)
        }

    }

    useEffect(() => {
        loadReviews()
    }, [])

    async function toggleLikeReview(
        userId: string,
        reviewId: string,
        currentLiked: boolean

    ) {

        setReviews(prev =>
            prev
                ? prev.map(r =>
                    r._id === reviewId ? { ...r, isLikedByUser: !currentLiked, likeCount: currentLiked ? r.likeCount - 1 : r.likeCount + 1 } : r
                )
                : prev
        );

        try {
            await toggleLikeReviewApi({ userId, reviewId });
        } catch (err) {
            console.error(err);
            setReviews(prev =>
                prev
                    ? prev.map(r =>
                        r._id === reviewId ? { ...r, isLikedByUser: currentLiked, likeCount: currentLiked ? r.likeCount + 1 : r.likeCount - 1 } : r
                    )
                    : prev
            );
        }
    }

    return (
        <div>

        {
        reviews.length > 0 ?
        <div className="space-y-8">{
            reviews.map(review => {
                return (
                    <div key={review._id} className="p-8 group bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="size-12 rounded-full overflow-hidden bg-slate-200">
                                <img alt="Sarah J." data-alt="Portrait of a woman with dark hair"
                                    src={review.user.profilePhoto} />
                            </div>
                            <div>
                                <h4 className="font-bold">La Piazza San Francis</h4>
                                <p className="text-xs text-slate-500">Downtown, CA</p>
                            </div>
                            <div className="ml-auto flex text-primary text-sm">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <span
                                        key={i}
                                        className={`material-symbols-outlined ${i < Math.floor(review.overallRating) ? "fill-1 text-primary" : "text-gray-300"
                                            }`}
                                    >
                                        star
                                    </span>
                                ))}
                            </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                            {review.text}
                        </p>
                        <div className="flex gap-3 overflow-x-auto no-scrollbar">
                            {
                                review.photos.map((photo) => {
                                    return <img alt="review photo" className="size-24 rounded-lg object-cover flex-shrink-0"
                                        data-alt="Creamy pasta with herbs and mushrooms"
                                        src={photo.url} />

                                })
                            }
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-700 flex justify-between items-center">
                            <button className={`flex items-center gap-1 text-lg ${review.isLikedByUser ? 'text-primary hover:text-slate-500' : 'hover:text-primary text-slate-500'}  transition-colors`}
                                onClick={async () => await toggleLikeReview(user!.userId, review._id, review.isLikedByUser)}
                            ><span className="material-symbols-outlined text-xl">thumb_up</span> {`(${review.likeCount})`}</button><span className="text-sm font-medium text-slate-500">{review.createdAt}</span>

                        </div>
                    </div>
                )

            })}

            {reviewsPagination?.cursor && <div className="mt-8 text-center">
                <button className="px-6 py-2 border border-primary text-primary font-bold rounded-lg hover:bg-primary/5 transition-colors" onClick={()=>loadReviews()}>
                    Load More
                </button>
            </div>
            }



        
        </div>
        :
        <div className="flex justify-center items-center text-slate-600 m-4">
            You have not written any reviews yet...
        </div>    
    }

    </div>
    )
}