import type { Dispatch, SetStateAction } from "react"
import { useAuth } from "../../../context/AuthContext"
import { toggleLikeReview as toggleLikeReviewApi, type Review } from "../../../apis/reviews"


export function ReviewTile({ review, setReviews }: { review: Review, setReviews: Dispatch<SetStateAction<Review[]>> }) {

    const { user } = useAuth()

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
        <div className="border-b-2 border-slate-200 dark:border-slate-800 pb-2 bg-white">
            <div className="flex items-center gap-4 mb-4">
                <div className="size-12 rounded-full overflow-hidden bg-slate-200">
                    <img alt={review.user.username}
                        src={review.user.profilePhoto} />
                </div>


                <div>
                    <h4 className="font-bold">{review.user.name}</h4>
                    <p className="text-xs text-slate-500"><span className="text-primary font-semibold">Level {review.user.level} Foodie</span> • {review.user.reviewCount} reviews</p>
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
                        return (
                            <img key={photo._id} className="mb-3 size-24 rounded-lg object-cover flex-shrink-0"

                                src={photo.url} />

                        )
                    })

                }
            </div>

            <div className="pt-4 border-t border-slate-50 dark:border-slate-700 flex justify-between items-center">
                <button className={`flex items-center gap-1 text-lg ${review.isLikedByUser ? 'text-primary hover:text-slate-500' : 'hover:text-primary text-slate-500'}  transition-colors`}
                    onClick={async () => await toggleLikeReview(user!.userId, review._id, review.isLikedByUser)}
                ><span className="material-symbols-outlined text-xl">thumb_up</span> {`(${review.likeCount})`}</button><span className="text-sm font-medium text-slate-500">{review.createdAt}</span>

                {/* {<button className="flex items-center gap-1 text-xs hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">chat_bubble</span> 2</button>} */}
            </div>
        </div>
    )
}