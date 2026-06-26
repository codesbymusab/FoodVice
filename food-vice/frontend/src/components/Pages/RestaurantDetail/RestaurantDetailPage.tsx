import { useEffect, useState } from "react";
import { type Rating } from "./RatingSummaryCard";
import {useNavigate, useParams } from "react-router";
import GoogleMapReact from "google-map-react";
import { useAuth } from "../../../context/AuthContext";
import { useAppLocation } from "../../../context/LocationContext";
import { Overview } from "./Overview";
import { Reviews } from "./Reviews";
import { Photos } from "./Photos";
import { Reels } from "./RestaurantReels";
import { fetchRestaurantDetails, fetchSimilarRestaurants, saveRestaurant as saveRestaurantApi, updateViews } from "../../../apis/restaurants";
import { fetchAISummary, type AISummary } from "../../../apis/ai";
import type { Review } from "../../../apis/reviews";
import { LoadingDialog } from "../../Shared/Feedback";


export type SimilarRestaurant = {

        _id: string,
        avgOverall?: number,
        restaurant: {
            _id: string,
            name: string,
            priceCategory: string,

        },
        distKm?: number,
        media?: {
            _id: string,
            url: string,
        }
    
}

export type RestaurantDetail = {
    restaurant: {
        _id: string,
        name: string,
        phone?: string,
        website?: string,
        description?: string,
        priceCategory?: string,

    },
    isOpen: boolean,
    openingTime?: string,
    location?: {

        _id: string,
        latitude: number,
        longitude: number,
        address?: string,
        city?: string,
        distKm?: number

    },
    media: {
        _id: string,
        url: string,

    },
    openingHours?:
    {
        _id: string,

        day: string,
        hours: string,
    }[],

    cuisines?:
    {
        cuisine: {
            _id: string,
            name: string
        }
    }[],
    labels?:
    {
        label: {
            _id: string,
            name: string,
            symbol: string
        }
    }[],
    rating?: Rating,
    reviewCount?: number,
    isSaved: boolean
    recentReviews:Review[],
    userReview:Review
}

type SelectedTab= 'Overview' |'Reviews' | 'Photos' | 'Reels'

export const Marker = ({ text }: { lat: number; lng: number; text: string }) => (
    <div className="w-20 relative">

        <span className="relative material-symbols-outlined text-red-700 text-3xl mt-1">explore_nearby</span>
        <span className="absolute bottom-10 -left-5 w-full text-blue-900 text-[0.8rem] font-extrabold" >{text}</span>

    </div>
);

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const d = new Date()

export function RestaurantDetailPage() {
    const params = useParams();
    const { location, loading: locationLoading } = useAppLocation();
    const [restaurantDetails, setRestaurantDetails] = useState<RestaurantDetail | null>(null);
    const [similarRestaurants, setSimilarRestaurants] = useState<SimilarRestaurant[]>([]);
    const [recentReviews, setRecentReviews] = useState<Review[]>([])
    const [userReview, setUserReview] = useState<Review[]>([])
    const [aiSummary, setAiSummary] = useState<AISummary | null>(null)
    const [selectedTab,setSelectedTab]=useState<SelectedTab>('Overview')

    const { user } = useAuth()
    const {id} =useParams()
    const navigate = useNavigate()

    async function loadRestaurant(location: [number, number] | null) {
        try {
            const details = await fetchRestaurantDetails({ restaurantId: params.id!, location, userId: user?.userId });
            setRestaurantDetails(details);
            console.log(restaurantDetails)
            if (details.recentReviews) setRecentReviews(details.recentReviews)
            if (details.userReview) setUserReview([details.userReview])
            if (details && details.restaurant?._id && details.restaurant?.name) {
              const summary = await fetchAISummary({
                restaurantId: details.restaurant._id,
                restaurantName: details.restaurant.name,
              });
              setAiSummary(summary);
            }
       
        } catch (error) {
            console.error(error);
        }
    }


    async function loadSimilarRestaurants(location: [number, number] | null) {
        try {
            const details = await fetchSimilarRestaurants({ restaurantId: params.id!, location });
            setSimilarRestaurants(details)
  
        } catch (error) {
            console.error(error);
        }
    }

    async function saveRestaurant(userId: string, restId: string) {
        try {
            await saveRestaurantApi({ userId, restId });
            setRestaurantDetails({
                ...restaurantDetails!,
                isSaved: !restaurantDetails!.isSaved
            })
        }
        catch (error) {
            console.error(error)
            return false
        }
    }

     async function updateView() {
            try {
                await updateViews({ restId: params.id!, userId:user!.userId });
            } catch (error) {
                console.error("Error tracking view:", error);
            }
        }



    useEffect(() => {
        if (!locationLoading) {
            loadRestaurant(location);
            updateView()
            loadSimilarRestaurants(location)
        }
    }, [locationLoading, location,id]);


    if (!restaurantDetails) {
        return <LoadingDialog message="Loading restaurant details..." />;
    }
    return (
        <main className="flex-1">

            <div className="relative h-[400px] w-full @container">
                <div className="absolute inset-0 bg-cover bg-center"

                    style={{ backgroundImage: `url(${restaurantDetails?.media.url}`, backgroundSize: 'contain', backgroundRepeat: 'repeat' }}>
                    <div
                        className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-background-dark/40 to-transparent">
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full px-4 md:px-10 pb-8">
                    <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="text-white">
                            <div className="flex items-center gap-2 mb-2">
                                <span
                                    className="rounded bg-primary px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-background-dark">{restaurantDetails.isOpen ? 'Open Now' : `Closed • ${restaurantDetails.openingTime && `Opens ${restaurantDetails.openingTime}`} `}</span>
                                {restaurantDetails.cuisines?.map((e) => {
                                    return (
                                        <span className="text-lg font-medium text-slate-100" key={e.cuisine._id}>• {e.cuisine.name}</span>
                                    )
                                })}

                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{restaurantDetails?.restaurant.name}</h1>
                            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm font-medium text-slate-200">
                                {restaurantDetails.reviewCount && (<div className="flex items-center gap-1 text-primary">
                                    <span className="material-symbols-outlined fill-1">star</span>
                                    <span className="text-lg font-bold">{(restaurantDetails.rating!.overallRating.toFixed(1))}</span>
                                    <span className="text-slate-200 font-normal">{`(${restaurantDetails.reviewCount} reviews)`}</span>
                                </div>)
                                }

                                {restaurantDetails.restaurant.priceCategory !== '' && <span>{restaurantDetails.restaurant.priceCategory}</span>}

                                {restaurantDetails.location?.distKm && (<div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-primary">location_on</span>
                                    <span>{restaurantDetails.location.distKm.toFixed(1)} KM away</span>

                                </div>
                                )}

                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button
                                className={`flex items-center gap-2 rounded-lg ${restaurantDetails.isSaved ? 'text-primary bg-primary/10 border-white/20 hover:bg-white/20' : 'bg-white/10 text-white border-primary/20 hover:bg-primary/20'} backdrop-blur-md px-4 py-2 text-sm font-bold border transition-all`} onClick={async () => await saveRestaurant(user!.userId, restaurantDetails.restaurant._id)}>
                                <span className="material-symbols-outlined text-lg">bookmark</span> {restaurantDetails.isSaved ? 'Saved' : 'Save'}
                            </button>
                            <button
                                className="flex items-center gap-2 rounded-lg bg-white/10 backdrop-blur-md px-4 py-2 text-sm font-bold text-white border border-white/20 hover:bg-white/20 transition-all">
                                <span className="material-symbols-outlined text-lg">share</span> Share
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="sticky top-[65px] z-40 bg-background-light dark:bg-background-dark border-b border-slate-200 dark:border-slate-800">
                <div className="mx-auto max-w-7xl px-4 md:px-10">
                    <div className="flex gap-4 overflow-x-auto no-scrollbar py-4">
                        <button className={` rounded-xl p-3 tab-active text-sm font-bold whitespace-nowrap ${selectedTab==='Overview' ? 'text-primary bg-primary/10':'hover:bg-primary/10 hover:text-primary'}`} onClick={()=>setSelectedTab('Overview')}>Overview</button>
                        <button  className={`rounded-xl p-3 tab-active text-sm font-bold whitespace-nowrap ${selectedTab==='Reviews' ? 'text-primary bg-primary/10':'hover:bg-primary/10 hover:text-primary'}`} onClick={()=>setSelectedTab('Reviews')}>Reviews</button>
                        <button  className={`rounded-xl p-3 tab-active text-sm font-bold whitespace-nowrap ${selectedTab==='Photos' ? 'text-primary bg-primary/10':'hover:bg-primary/10 hover:text-primary'}`} onClick={()=>setSelectedTab('Photos')}>Photos</button>
                        {/* <button  className={`rounded-xl p-3 tab-active text-sm font-bold whitespace-nowrap ${selectedTab==='Reels' ? 'text-primary bg-primary/10':'hover:bg-primary/10 hover:text-primary'}`} onClick={()=>setSelectedTab('Reels')}>Reels</button> */}
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 md:px-10 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {selectedTab==='Overview' && <Overview restaurantDetails={restaurantDetails} recentReviews={recentReviews} userReview={userReview} setRecentReviews={setRecentReviews} setUserReview={setUserReview} aiSummary={aiSummary} fetchRestaurant={loadRestaurant} location={location}/>}
                    {selectedTab==='Reviews' && <Reviews userReview={userReview} setUserReview={setUserReview}/>}
                    {selectedTab==='Photos' && <Photos/>}
                    {selectedTab==='Reels' && <Reels/>}
                    
                    <aside className="space-y-8">

                        {restaurantDetails.location && (<div
                            className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                            <div className="h-48 w-full bg-slate-200 relative">
                                <GoogleMapReact
                                    bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_MAPS_KEY as string }}

                                    center={{ lat: restaurantDetails.location?.latitude, lng: restaurantDetails.location?.longitude }}
                                    defaultZoom={17}

                                >
                                    <Marker lat={restaurantDetails.location.latitude} lng={restaurantDetails.location.longitude} text={restaurantDetails.restaurant.name} />
                                </GoogleMapReact>
                            </div>
                            <div className="p-6">
                                <div className="flex items-start gap-3 mb-4">
                                    <span className="material-symbols-outlined text-primary mt-1">pin_drop</span>
                                    <div>
                                        <p className="font-bold">{restaurantDetails.location?.address}</p>
                                        <p className="text-sm text-slate-500">Downtown District, CHI 60601</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 mb-4">
                                    <span className="material-symbols-outlined text-primary mt-1">call</span>
                                    <p className="font-medium text-slate-900 dark:text-slate-100">{restaurantDetails.restaurant.phone}</p>
                                </div>
                                <div className="flex items-start gap-3 mb-6">
                                    <span className="material-symbols-outlined text-primary mt-1">language</span>
                                    <a className="font-medium text-accent-cyan hover:underline overflow-hidden"
                                        href={restaurantDetails.restaurant.website} target="_blank">{restaurantDetails.restaurant.website}</a>
                                </div>
                                <a href={`https://www.google.com/maps/dir/${location?.[0]},${location?.[1]}/${restaurantDetails.location?.latitude},${restaurantDetails.location?.longitude}`} target="_blank"><button
                                    className="w-full py-3 rounded-lg border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all">Get
                                    Directions</button></a>
                            </div>
                        </div>
                        )}
                        <div
                            className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">schedule</span> Hours
                            </h4>
                            <div className="space-y-2 text-sm">
                                {
                                    restaurantDetails.openingHours?.map((e) => {


                                        return (
                                            <div className={`flex justify-between ${e.day === days[d.getDay()] && 'text-primary font-bold'} `} key={e._id}>
                                                <span>{e.day}</span>
                                                <span>{e.hours}</span>
                                            </div>
                                        )
                                    })
                                }

                            </div>
                        </div>
                        { similarRestaurants.length > 0 && (
                            <div>
                                <h4 className="text-lg font-bold mb-4">People Also Liked</h4>


                                <div className="space-y-4">

                                    {
                                        similarRestaurants.map((r) => {
                                            return (
                                                <div key={r._id} className="flex gap-4 group" onClick={() => navigate(`/restaurant/${r._id}`)}>
                                                    {r.media && (
                                                        <div className="size-20 rounded-lg overflow-hidden flex-shrink-0">
                                                            <img
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"

                                                                src={r.media.url} />

                                                        </div>)}
                                                    <div className="flex flex-col justify-center">
                                                        <p className="font-bold group-hover:text-primary transition-colors">{r.restaurant.name}
                                                        </p>
                                                        <div className="flex items-center gap-1 text-xs text-primary">
                                                            <span className="material-symbols-outlined text-sm fill-1">star</span> {r.avgOverall?.toFixed(1)}
                                                            {r.restaurant.priceCategory !== '' && `• ${r.restaurant.priceCategory}`}
                                                        </div>
                                                        <p className="text-xs text-slate-500">{r.distKm?.toFixed(1)} Km away</p>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </main>
    )
}