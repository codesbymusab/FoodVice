import { useEffect, useState } from "react";
import { AchievementBadge, AchievementBadgeAlt } from "./Components/AchievementBadge";
import { SavedRestaurant } from "./Components/SavedRestaurant";
import { useParams } from "react-router";
import { EditProfilePage } from "./EditProfilePage";
import { fetchUserProfile as loadUserProfileData, fetchSavedRestaurants} from "../../../apis/profile";
import type { Restaurant } from "../RestaurantDetail/RestaurantDetailPage";
import { useAuth } from "../../../context/AuthContext";
import { LoadingDialog } from "../../Shared/Feedback";
import type { Review } from "../../../apis/reviews";
import { UserReels } from "./Sections/UserReels";
import { UserReviews } from "./Sections/UserReviews";


export type UserProfile = {
    _id: string,
    userId: string
    name: string,
    username: string
    email: string,
    profilePhoto?: string,
    level: number,
    followersCount: number,
    followingCount: number,
    savedRestaurantsCount: number,
    savedReelsCount: number,
    reviewsCount: number,
    address?: string,
    bio?: string,
    provider: string
}

type SelectedTab = 'restaurants' | 'reviews' | 'reels'
export function UserProfilePage() {


    const params = useParams()
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [showEditForm, setShowEditForm] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState<SelectedTab>('restaurants')
    const { user } = useAuth()
    async function fetchUserProfile() {
        try {
            setLoading(true);

            const [profileData, restaurantsData] = await Promise.all([
                loadUserProfileData(params.id!),
                fetchSavedRestaurants(params.id!),

            ]);

            setUserProfile(profileData);
            setRestaurants(restaurantsData);






        } catch (err) {
            console.error("Error fetching user profile data:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUserProfile();
    }, [params.id]);


    function changeTab(tab: SelectedTab): void {
        setSelectedTab(tab)
    }
    function editProfile() {
        setShowEditForm(true)
    }

    if (loading) return <LoadingDialog message="Loading profile..." />

    if (showEditForm) {
        return <EditProfilePage profile={userProfile!} setShowEditForm={setShowEditForm} fetchProfile={fetchUserProfile} />
    }

    if (!userProfile) return <LoadingDialog message="Failed to load user profile. Retrying..." />

    return (


        <main className="max-w-4xl mx-auto px-4 py-10">

            <div className="bg-white dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden mb-8">
                <div className="p-8 flex flex-col md:flex-row items-center gap-8">

                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl"></div>
                        <div className="relative size-32 md:size-40 rounded-full border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden">
                            <img alt="Profile" className="w-full h-full object-cover" src={userProfile!.profilePhoto} />

                        </div>
                        <div className="absolute bottom-2 right-2 bg-accent text-white p-1.5 rounded-full border-4 border-white dark:border-slate-800 shadow-lg">
                            <span className="material-symbols-outlined text-sm block">verified</span>
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{userProfile!.name}</h1>
                            {userProfile?.username && <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center md:justify-start gap-1.5 mt-1">
                                <span className="material-symbols-outlined text-xl">person</span> {userProfile.username}
                            </p>
                            }
                            {userProfile?.bio && userProfile.bio !== '' && <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center md:justify-start gap-1.5 mt-1">
                                <span className="material-symbols-outlined text-xl">account_box</span> {userProfile.bio}
                            </p>
                            }
                            {userProfile?.address && userProfile.address !== '' && <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center md:justify-start gap-1.5 mt-1">
                                <span className="material-symbols-outlined text-xl">location_on</span> {userProfile.address}
                            </p>
                            }
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">

                            {user!.userId !== userProfile!.userId ? (<button className="inline-flex items-center gap-2 px-6 py-2 bg-accent-cyan text-white rounded-full text-sm font-bold hover:opacity-90 transition-all shadow-md">
                                <span className="material-symbols-outlined text-sm">person_add</span> Follow

                            </button>
                            )
                                :
                                (<button className="shadow-xl shadow-orange-500/5 inline-flex items-center gap-2 px-5 py-2 border border-slate-300 dark:border-slate-700 rounded-full text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors" onClick={() => editProfile()}>
                                    <span className="material-symbols-outlined text-sm">edit</span> Edit Profile
                                </button>
                                )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 min-w-[120px]">
                        <div className="bg-primary text-white px-4 py-2 rounded-xl text-center shadow-sm">
                            <p className="text-xl font-bold">{userProfile?.followersCount}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-90">Followers</p>
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-700/50 px-4 py-2 rounded-xl text-center border border-slate-200 dark:border-slate-600">
                            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{userProfile?.followingCount}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Following</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center mb-12">
                <div className="w-full max-w-md bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-primary/10 shadow-sm">
                    <div className="flex justify-between items-end mb-4">
                        <div className="text-left">
                            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Trust Score</p>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">100<span className="text-lg text-slate-400 font-normal">/1000</span></h3>
                        </div>
                        <div className="text-right">
                            <span className="inline-flex items-center gap-1 bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold">
                                <span className="material-symbols-outlined text-xs">auto_awesome</span> LEVEL {userProfile!.level}
                            </span>
                        </div>
                    </div>
                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-accent transition-all" style={{ width: "10%" }}></div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-3 italic text-center">Calculated based on review quality, community helpfulness, and verified visits.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-12">
                <div className="bg-white dark:bg-slate-800/40 p-5 rounded-xl border border-slate-100 dark:border-slate-700 text-center hover:border-primary/30 transition-colors">
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{userProfile?.reviewsCount}</p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Reviews</p>
                </div>
                <div className="bg-white dark:bg-slate-800/40 p-5 rounded-xl border border-slate-100 dark:border-slate-700 text-center hover:border-primary/30 transition-colors">
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{userProfile!.savedReelsCount + userProfile!.savedRestaurantsCount}</p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Saved</p>
                </div>
            </div>

            {/* <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">military_tech</span>
                        Achievements
                    </h2>
                    <button className="text-xs font-bold text-primary hover:underline">View All</button>
                </div>
                <div className="flex flex-wrap gap-4">
                    <AchievementBadge />
                    <AchievementBadgeAlt />
                    <AchievementBadgeAlt />
                    <AchievementBadge />
                    <AchievementBadgeAlt />
                </div>
            </div> */}

            <div className="mt-12">
                <div className="flex border-b border-slate-200 dark:border-slate-700 mb-8">

                    <button className={`px-6 md:px-8 py-4 text-sm font-medium ${selectedTab === 'restaurants' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'} transition-all`}
                        onClick={() => changeTab('restaurants')}>
                        Saved Restaurants
                    </button>
                    <button className={`px-6 md:px-8 py-4 text-sm font-medium ${selectedTab === 'reviews' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'} transition-all`}
                        onClick={() => changeTab('reviews')}>
                        My Reviews
                    </button>
                    <button className={`px-6 md:px-8 py-4 text-sm font-medium ${selectedTab === 'reels' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'} transition-all`}
                        onClick={() => changeTab('reels')}>
                        Reels
                    </button>
                </div>

                {selectedTab === 'restaurants' && (<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {
                        restaurants && restaurants.slice(0, 2).map((restaurant) => {
                            return <SavedRestaurant key={restaurant.restaurant._id} restaurant={restaurant} />
                        })
                    }


                </div>
                )
                }

                {selectedTab === 'reviews' && (


                    <UserReviews userId={params.id!} />
                    
                )}
                {selectedTab === 'reels' && (

                    <UserReels userId={params.id!} />
                )}
            </div>

        </main>
    )
}