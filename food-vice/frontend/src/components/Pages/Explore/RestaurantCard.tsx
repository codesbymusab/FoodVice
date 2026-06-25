import { useNavigate } from "react-router"
import { useAuth } from "../../../context/AuthContext"
import { saveRestaurant as saveRestaurantApi } from "../../../apis/restaurants"
import type { Dispatch, SetStateAction } from "react"

export type TopRatedRestaurant =
    {
        _id: string,
        name: string,
        distKm: number,
        avgOverall: number,
        cuisines: string[],
        priceCategory: string,
        isOpen?: boolean,
        openingTime?: string
        media?: {
            _id: string,
            url: string,
        },
        latitude: number,
        longitude: number,
        isSaved: boolean

    }
export type RecommendedRestaurant = TopRatedRestaurant
    

export function RestaurantCard({ restaurant, setTopRatedRestaurants }: { restaurant: TopRatedRestaurant, setTopRatedRestaurants: Dispatch<SetStateAction<TopRatedRestaurant[] | null>> }) {
    const navigate = useNavigate()
    const { user } = useAuth()

    async function saveRestaurant(userId: string, restId: string) {
        try {
            await saveRestaurantApi({ userId, restId });
            setTopRatedRestaurants(prev =>
                prev
                    ? prev.map(r =>
                        r._id === restId ? { ...r, isSaved: !r.isSaved } : r
                    )
                    : prev
            );
        } catch (error) {
            console.error(error);
            return false;
        }
    }


    return (
        <div className="group relative flex flex-col rounded-xl border border-primary/5 bg-white dark:bg-slate-800/50 shadow-sm overflow-hidden hover:shadow-xl transition-all" >
            <div
                className="h-48 bg-cover scale-105 hover:scale-110"

                style={{
                    backgroundImage: `url(${restaurant.media?.url})`
                }}
                onClick={() => navigate(`/explore/restaurant/${restaurant._id}`)}
            >


            </div>
            <div className="p-4 flex flex-col flex-1" onClick={() => navigate(`/explore/restaurant/${restaurant._id}`)}>
                <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                        {restaurant.name}
                    </h3>

                </div>
                <p className="text-sm text-slate-500 mb-3">{restaurant.cuisines.slice(0,3).map((cuisine)=>{
                    return `• ${cuisine} `
                })}</p>
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                            <span className="material-symbols-outlined text-sm text-accent">location_pin</span> {restaurant.distKm.toFixed(1)} Km away
                        </span>
                        <span className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400 border-l border-slate-300 dark:border-slate-700 pl-2">
                            <span className="material-symbols-outlined text-sm text-accent">schedule</span> {restaurant.isOpen && restaurant.isOpen ? 'Open Now' : `Opens ${restaurant.openingTime}`}
                        </span>
                        <span className="text-sm text-slate-600">{restaurant.priceCategory}</span>

                    </div>
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-lg flex items-center gap-1 shadow-sm">
                        <span className="material-symbols-outlined text-sm text-primary fill-current">star</span>
                        <span className="text-sm font-bold">{restaurant.avgOverall.toFixed(1)}</span>
                    </div>
                </div>
            </div>
            <button className={`absolute top-2 right-2 material-symbols-outlined text-3xl ${restaurant.isSaved ? 'text-primary bg-primary/30 hover:text-white' : 'text-white hover:text-primary'} rounded-lg  backdrop-blur-sm transition-all`} onClick={async () => await saveRestaurant(user!.userId, restaurant._id)}>
                bookmark
            </button>
        </div>
    )
}


