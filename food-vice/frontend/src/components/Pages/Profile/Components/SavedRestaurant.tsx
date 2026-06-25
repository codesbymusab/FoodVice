import type { Restaurant } from "../../RestaurantDetail/RestaurantDetailPage";

export function SavedRestaurant({restaurant}:{restaurant:Restaurant}){
    return (
        <div className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
            <div className="relative h-48 overflow-hidden">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="restaurant cover photo" src={restaurant.media.url} />
                <div className="absolute top-3 right-3">
                    <button className="bg-white/90 backdrop-blur p-2 rounded-full text-primary shadow-sm">
                        <span className="material-symbols-outlined fill">bookmark</span>
                    </button>
                </div>
                <div className="absolute bottom-3 left-3 bg-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide shadow-sm">
                    {} • {restaurant.restaurant.priceCategory}
                </div>
            </div>
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg">{restaurant.restaurant.name}</h4>
                    <div className="flex items-center gap-1 text-primary">
                        <span className="material-symbols-outlined text-sm fill-1">star</span>
                        <span className="text-sm font-bold">{restaurant.rating?.overallRating}</span>
                    </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{restaurant.restaurant.description}</p>
                <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-700 flex justify-between items-center">
                    <span className="text-xs font-medium text-slate-400">Saved 2 days ago</span>

                </div>
            </div>
        </div>
    )
}