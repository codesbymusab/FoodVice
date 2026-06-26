import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import type { TopRatedRestaurant } from "../../Explore/RestaurantCard";
import { NearByCard } from "../Cards/NearByCard";
import { Marker, UserMarker } from "../../Explore/ExploreMapView";
import GoogleMapReact from "google-map-react";
import { fetchNearbyRestaurants } from "../../../../apis/restaurants";
import { useAppLocation } from "../../../../context/LocationContext";

export function Nearby() {
    const { location } = useAppLocation()
    const [nearbyRestaurants, setNearbyRestaurants] = useState<TopRatedRestaurant[]>([]);
    const { user } = useAuth()




    async function loadNearbyRestaurants(location: [number, number] | null) {
        try {
            const details = await fetchNearbyRestaurants({
                userId: user!.userId,
                filters: { cuisine: 'All', price: '', rating: 0, dist: 3 },
                location,
            });
            setNearbyRestaurants(details);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        loadNearbyRestaurants(location)
    }, [location]);



    return (
        <section className="px-4 mb-16">
            <h3 className="text-2xl font-bold mb-6">Nearby Restaurants</h3>

            {!location && <div className="w-full flex justify-center  gap-3">
                <span className="text-primary text-7xl">...</span>
                <h3 className="text-xl mt-10 font-bold flex items-center justify-center">Location not supported</h3>
                <span className="text-primary text-7xl">...</span>
            </div>}

            {!nearbyRestaurants || nearbyRestaurants.length === 0 && <div className="w-full flex justify-center  gap-3">
                <span className="text-primary text-7xl">...</span>
                <h3 className="text-xl mt-10 font-bold flex items-center justify-center">No restaurants found</h3>
                <span className="text-primary text-7xl">...</span>
            </div>
            }
           
            {nearbyRestaurants && nearbyRestaurants.length > 0 && location && (
                <div className="flex flex-col lg:flex-row gap-6 h-[500px]">


                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 no-scrollbar p-8">

                        {
                            nearbyRestaurants && nearbyRestaurants.length > 0 && nearbyRestaurants.map((restaurant) => {
                                return <NearByCard key={restaurant._id} restaurant={restaurant} />
                            })
                        }

                    </div>
                    <div className="flex-[1.5] rounded-3xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl relative min-h-[300px]">


                        <GoogleMapReact
                            bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_MAPS_KEY }}
                            defaultZoom={12}
                            defaultCenter={{ lat: nearbyRestaurants![0].latitude, lng: nearbyRestaurants![1].longitude }}
                            yesIWantToUseGoogleMapApiInternals
                            onGoogleApiLoaded={({ map, maps }) => {
                                map.setOptions({
                                    zoomControl: true,
                                    fullscreenControl: false,
                                    streetViewControl: false,
                                });
                            }}
                        >
                            <UserMarker lat={location[0]} lng={location[1]} />
                            {
                                nearbyRestaurants && nearbyRestaurants.map((restaurant) => {
                                    return <Marker key={restaurant._id} lat={restaurant.latitude} lng={restaurant.longitude} restaurant={restaurant} />
                                })
                            }

                        </GoogleMapReact>


                    </div>




                </div>
            )
            }
        </section >
    )
}