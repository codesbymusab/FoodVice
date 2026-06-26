import { useState, useEffect } from "react";
import { TrendingCard } from "../Cards/TrendingCard";
import { fetchTrendingRestaurants, type TrendingRestaurant } from "../../../../apis/restaurants";
import { useAppLocation } from "../../../../context/LocationContext";
import { ErrorScreen, SkeletonTrendingList } from "../../../Shared/Feedback";

export function Trending() {

    const [trendingRestaurants, setTrendingRestaurants] = useState<TrendingRestaurant[]>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { location } = useAppLocation()




    async function loadTrendingRestaurants(location: [number, number] | null) {
        setLoading(true);
        setError(null);
        try {

            const details = await fetchTrendingRestaurants({
                maxDistance: 50,
                location,
            });
            setTrendingRestaurants(details);
        } catch (error) {
            console.error(error);
            setError("Unable to load top rated restaurants. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTrendingRestaurants(location)
    }, [location]);

    return (
        <section className="px-4 mb-16">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">trending_up</span> Trending Restaurants
                </h3>
                <a className="text-primary font-bold text-sm hover:underline" href="#">View All</a>
            </div>
            {
                loading ? (
                    <SkeletonTrendingList count={3} />
                ) : error ? (
                    <div className="col-span-full">
                        <ErrorScreen title="Unable to load top rated restaurants" message={error} onRetry={() => loadTrendingRestaurants(location)} />
                    </div>
                ) :
                    <div className="flex overflow-x-auto gap-6 pb-6 no-scrollbar snap-x">

                        {
                            trendingRestaurants && trendingRestaurants.map((restaurant) => {
                                return <TrendingCard key={restaurant._id} restaurant={restaurant} />
                            })
                        }


                    </div>
            }
        </section>
    )
}