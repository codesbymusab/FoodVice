import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { Restaurant } from "./RestaurantDetailPage";
import { ReviewTile } from "./ReviewTile";
import { AddReviewForm } from "./AddReviewForm";
import { RatingSummaryCard } from "./RatingSummaryCard";
import { AIVerdictCard } from "./AIVerdictCard";
import type { AISummary } from '../../../apis/ai';
import type { Review } from "../../../apis/reviews";


type OverviewProps = {
    restaurantDetails: Restaurant,
    userReview: Review[],
    recentReviews: Review[],
    setUserReview: Dispatch<SetStateAction<Review[]>>,
    setRecentReviews: Dispatch<SetStateAction<Review[]>>,
    aiSummary?: AISummary | null,
    fetchRestaurant: (location: [number, number] | null) => Promise<void>,
    location: [number, number] | null

}

export function Overview({ restaurantDetails, userReview, recentReviews, setUserReview, setRecentReviews, aiSummary, fetchRestaurant, location }: OverviewProps) {

    const [showReviewForm, setShowReviewForm] = useState(false);

    useEffect(() => {
        if (!showReviewForm) {
            window.scrollTo(0, 0);
        }
    }, [showReviewForm]);


    return (
        <div className="lg:col-span-2 space-y-10 p-8 rounded-xl">

            <section>
                <h3 className="text-xl font-bold mb-4">About the Restaurant</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {restaurantDetails?.restaurant.description}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                    {restaurantDetails.labels?.map((e) => {
                        return (
                            <div
                                className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10" key={e.label._id}>
                                <span className="material-symbols-outlined text-primary">{e.label.symbol}</span>
                                <span className="text-sm font-medium">{e.label.name}</span>
                            </div>
                        )
                    })}


                </div>
            </section>
            {restaurantDetails.rating &&
                <section
                    className="p-6 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">

                    <RatingSummaryCard rating={restaurantDetails.rating} />
                </section>
            }
            {aiSummary ? (
                <section className="rounded-3xl border border-slate-200 bg-slate-100 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <AIVerdictCard summary={aiSummary} />
                </section>
            ) : null}

            <section>

                {showReviewForm ? <AddReviewForm setShowReviewForm={setShowReviewForm} fetchRestaurant={fetchRestaurant} location={location} />

                    : (


                        <>

                            {userReview.length > 0 &&
                                (
                                    <div className="mb-6">
                                        <h3 className="text-xl font-bold mb-6">Your Review</h3>

                                        <div className="space-y-8 bg-white rounded-3xl p-4">
                                            {

                                                userReview.map((review) => {
                                                    return <ReviewTile key={review._id} review={review} setReviews={setUserReview} />
                                                })

                                            }


                                        </div>
                                    </div>
                                )}

                            <div className="flex items-center justify-between mb-6 ">
                                <h3 className="text-xl font-bold">Recent Reviews</h3>

                                {userReview.length=== 0 && (<button className="flex items-center justify-center gap-2 text-primary font-bold text-sm hover:scale-110" onClick={() => { setShowReviewForm((prev) => !prev) }}>
                                    <span className="material-symbols-outlined text-lg">edit</span> <span className="hover:underline underline-offset-4">Write a Review</span>
                                </button>)

                                }
                            </div>


                            {recentReviews.length > 0 ? <div className="space-y-8 bg-white rounded-3xl p-4">
                                {
                                    recentReviews!.map((review) => {
                                        return <ReviewTile key={review._id} review={review} setReviews={setRecentReviews} />
                                    })
                                }


                            </div>
                                :
                                userReview.length===0 && <div className="mt-24 flex text-xl justify-center items-center text-slate-600 font-bold">
                                    Be the first to review this restaurant
                                </div>
                            }
                        </>

                    )
                }
            </section>
        </div>
    )
}