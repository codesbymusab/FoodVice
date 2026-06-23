import { useEffect, useState } from "react";
import { ReelCard } from "../Cards/ReelCard";
import { useAuth } from "../../../../context/AuthContext";
import { ErrorScreen, SkeletonReelCard} from "../../../Shared/Feedback";
import { fetchRecentReels, type Reel } from "../../../../apis/reels";

export function Reels() {


    const [reels, setReels] = useState<Reel[] | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const { user } = useAuth()
    async function loadRecentReels() {
        setLoading(true)
        setError(null)
        try {
            const result = await fetchRecentReels({ userId: user!.userId, tag: 'All' });
            setReels(result?.data ?? null);
                        
        } catch (error) {
            console.error(error);
            setError("Unable to load reels. Please try again.");
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadRecentReels()
    }, [])



    return (
        <section className="px-4 mb-16 bg-slate-900 -mx-4 py-12 lg:rounded-3xl lg:mx-4 text-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-2 mb-8">
                    <span className="material-symbols-outlined text-primary text-3xl">play_circle</span>
                    <h3 className="text-2xl font-bold">Food Reels</h3>
                    <span className="ml-auto px-3 py-1 bg-primary text-xs font-bold rounded-full uppercase tracking-tighter">Trending</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    {loading ? (

                        Array.from({ length: 3 }).map((_, index) => {
                            return <SkeletonReelCard key={index} />
                        }
                        )
                    ) : error ? (
                        <div className="col-span-full">
                            <ErrorScreen title="Could not load reels" message={error} onRetry={loadRecentReels} />
                        </div>
                    ) : reels && reels.length > 0 ? (
                        reels.slice(0, 5).map((reel) => {
                            return <ReelCard key={reel._id} reel={reel} />
                        })
                    ) : (
                        <div className="col-span-full rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                            No reels are available yet.
                        </div>
                    )}
                </div>
                
            </div>
    
        </section>
    )
}