import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { TopRatedRestaurant } from "../../Explore/RestaurantCard";
import { TopRatedCard } from "../Cards/TopRatedCard";
import { useAuth } from "../../../../context/AuthContext";
import { ErrorScreen, SkeletonTopRatedList } from "../../../Shared/Feedback";
import { fetchTopRatedRestaurants } from "../../../../apis/restaurants";
import type { Cuisine, Filter } from "../../Explore/ExplorePage";
import { useAppLocation } from "../../../../context/LocationContext";

export function TopRated({ filters, cuisines, setFilters }: { cuisines: Cuisine[] | null, filters: Filter | null, setFilters: Dispatch<SetStateAction<Filter | null>> }) {

    const [topRatedRestaurants, setTopRatedRestaurants] = useState<TopRatedRestaurant[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth()
    const { location } = useAppLocation()




    async function loadTopRatedRestaurants(location: [number, number] | null, filters: Filter | null) {
        setLoading(true);
        setError(null);
        try {
        
            const result = await fetchTopRatedRestaurants({
                userId: user!.userId,
                filters: filters ? filters : { cuisine: 'All', price: '', rating: 0, dist: 50 },
                location,
            });
            setTopRatedRestaurants(result?.data ?? null);
        } catch (error) {
            console.error(error);
            setError("Unable to load top rated restaurants. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTopRatedRestaurants(location, filters)
    }, [filters,location]);



    return (


        <section className="px-4 mb-16">
            <h3 className="text-2xl font-bold mb-6">Top Rated This Week</h3>
            <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
                <button className={`px-6 py-2 rounded-full ${filters?.cuisine === 'All' ? 'bg-primary text-white' : 'bg-white border-2 border-primary/50'} 'font-bold text-sm`} onClick={() => setFilters({ ...filters, cuisine: 'All' })}>All</button>
                {cuisines && cuisines.slice(0, 6).map((cuisine) => {
                    return (<button className={`px-6 py-2 rounded-full ${cuisine.name === filters?.cuisine ? 'bg-primary text-white' : 'bg-white border-2 border-primary/50'} 'font-bold text-sm`} key={cuisine._id} onClick={() => setFilters({ ...filters, cuisine: cuisine.name })}>{cuisine.name}</button>)
                })}

            </div>

            {loading ? (
                <SkeletonTopRatedList count={6} />
            ) : error ? (
                <div className="col-span-full">
                    <ErrorScreen title="Unable to load top rated restaurants" message={error!} onRetry={() => loadTopRatedRestaurants(location, filters)} />
                </div>
            ) :
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {
                        topRatedRestaurants && topRatedRestaurants.length > 0 ? (
                            topRatedRestaurants.map((restaurant) => {
                                return <TopRatedCard key={restaurant._id} restaurant={restaurant} />
                            })
                        ) : (
                            <div className="col-span-full rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                                No top rated restaurants are available yet.
                            </div>
                        )
                    }


                </div>
            }
        </section>
    )
}