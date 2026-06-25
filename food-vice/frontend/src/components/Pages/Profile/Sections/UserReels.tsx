import { useEffect, useState } from "react";
import type { Reel } from "../../../../apis/reels";
import type { cursorPagination } from "../../../../apis/restaurants";

import { fetchUserReels } from "../../../../apis/profile";
import { ReelCard } from "../../Home/Cards/ReelCard";

export function UserReels({ userId }: { userId: string }) {

    const [userReels, setUserReels] = useState<Reel[] | null>(null);
    const [savedReels, setSavedReels] = useState<Reel[] | null>(null);
    const [savedReelsPagination, setSavedReelsPagination] = useState<cursorPagination | null>(null)
    const [userReelsPagination, setUserReelsPagination] = useState<cursorPagination | null>(null)

    async function loadReels() {
        try {
        
            const reelsData = await fetchUserReels(userId)



            if (reelsData) {
                console.log(reelsData)
                if (savedReelsPagination?.cursor) {
                    setSavedReels([...savedReels!, ...reelsData.saved.data])
                }
                else {
                    setSavedReels(reelsData.saved.data)
                }

                if (userReelsPagination?.cursor) {
                    setUserReels([...userReels!, ...reelsData.user.data])
                }
                else {
                    setUserReels(reelsData.user.data)
                }

                setUserReelsPagination(reelsData.saved.pagination ?? null)
                setSavedReelsPagination(reelsData.user.pagination ?? null)

            }


        } catch (err) {
            console.error("Error fetching user profile data:", err);
        }
    }

    useEffect(() => {
        loadReels()
    }, [])

    return (

        <>
            <div className="max-w-7xl mx-auto ">
                <div className="mt-12 p-8 text-white bg-slate-900 rounded-2xl hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-2 mb-8">
                        <span className="material-symbols-outlined text-primary text-3xl">camera</span>
                        <h3 className="text-2xl font-bold">Yours</h3>
                    </div>
                    {userReels && userReels.length > 0 ?
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">

                            {userReels.map((reel) => {
                                return <ReelCard key={reel._id} reel={reel} />
                            })
                            }
                        </div>
                        :
                        <div className="flex justify-center items-center m-4">
                            No reels uploaded... Share your first reel with community!
                        </div>
                    }
                </div>

                <div className="mt-12 p-8 bg-white rounded-2xl hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-2 mb-8">
                        <span className="material-symbols-outlined text-primary text-3xl">favorite</span>
                        <h3 className="text-2xl font-bold">Favorites</h3>
                    </div>
                    {savedReels && savedReels.length > 0 ?
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 text-white">
                            {savedReels.map((reel) => {
                                return <ReelCard reel={reel} />
                            })}
                        </div>
                        :
                        <div>
                            No reels saved yet...
                        </div>
                    }
                </div>


            </div>

            {/* <div className="mt-8 text-center">
                            <button className="px-6 py-2 border border-primary text-primary font-bold rounded-lg hover:bg-primary/5 transition-colors">
                                Load More
                            </button>
                        </div> */}

        </>
    )
}