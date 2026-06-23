import { useEffect, useState, type Dispatch } from "react"
import { ReviewTile } from "./ReviewTile"
import { useParams } from "react-router"
import { fetchReviews, type Review } from "../../../apis/reviews"
import type { cursorPagination } from "../../../apis/restaurants"

type ReviewProps = {

    userReview: Review[] | null,
    setUserReview: Dispatch<React.SetStateAction<Review[] | null>>,
}
export function Reviews({ userReview, setUserReview }: ReviewProps) {
    const params = useParams()

    const [reviews, setReviews] = useState<Review[] | null>(null)
    const [reviewsPagination, setReviewsPagination] = useState<cursorPagination | null>()
    async function loadReviews() {
        try {
            const result = await fetchReviews({ restId: params.id!, limit: 5, cursor: reviewsPagination?.cursor });
            if (result && result.data.length > 0) {
                if (reviewsPagination?.cursor) {
                    setReviews([...reviews!, ...result.data])
                } else {
                    setReviews(result.data)
                }
                setReviewsPagination(result.pagination ?? null)
            }

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        loadReviews()
    }, [])

    return (
        <section className="lg:col-span-2 space-y-10 p-8 rounded-xl">

            {userReview &&
                (
                    <div className="mb-6">
                        <h3 className="text-xl font-bold mb-6">Your Review</h3>

                        <div className="space-y-8 bg-white rounded-3xl p-4">
                            {

                                userReview?.map((review) => {
                                    return <ReviewTile key={review._id} review={review} setReviews={setUserReview} />
                                })

                            }


                        </div>
                    </div>
                )}

            <div className="flex items-center justify-between mb-6 ">

                <h3 className="text-xl font-bold">Reviews</h3>

            </div>


            {reviews && reviews.length > 0 ? <div className="space-y-8 bg-white rounded-3xl p-4">
                {
                    reviews!.map((review) => {
                        return <ReviewTile key={review._id} review={review} setReviews={setReviews} />
                    })
                }


            </div>
                :
                !userReview && <div className="mt-24 flex text-xl justify-center items-center text-slate-600 font-bold">
                    Be the first to review this restaurant
                </div>
            }

            {reviewsPagination?.cursor && <div className='flex items-center justify-center'>
                <button className="px-4 py-3  mb-4 border-2 bg-white rounded-2xl border-primary text-primary font-bold text-sm hover:underline hover:scale-105" onClick={async () => loadReviews()}>
                    View More
                </button>
            </div>}
        </section>
    )
}