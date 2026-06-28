import { useEffect, useState } from "react";
import { ReelCard } from "./ReelCard";
import { UploadReelForm } from "./UploadForm";
import { useAuth } from "../../../context/AuthContext";
import { UploadProgressDialog } from "./ProgressDialouge";
import { ErrorScreen, SkeletonReelGrid, SkeltonReelTagsCard } from "../../Shared/Feedback";
import { fetchRecentReels, fetchFollowersReels, fetchPopularTags, uploadReel as uploadReelApi, saveReel as saveReelApi, toggleLikeReel as toggleLikeReelApi, fetchReelById, fetchSuggestedAccounts, type SuggestedAccount, type Reel, type ReelTag } from "../../../apis/reels";
import { useNavigate, useParams } from "react-router";
import type { cursorPagination } from "../../../apis/restaurants";

type ReelsMode = 'for-you' | 'following' | 'discover'

export function ReelsPage() {

    const params = useParams()
    const [reelsMode, setReelsMode] = useState<ReelsMode | null>(params.id ? null : 'for-you')
    const [showUploadForm, setShowUploadForm] = useState<boolean>(false)
    const [uploading, setUploading] = useState<boolean>(false)
    const [progress, setProgress] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const [reels, setReels] = useState<Reel[]>([])
    const [popularTags, setPopularTags] = useState<ReelTag[]>([])
    const [error, setError] = useState<string | null>(null)
    const [selectedtag, setSelectedTag] = useState<string | null>(params.id ? null : 'All')
    const [suggestedAccounts, setSuggestedAccounts] = useState<SuggestedAccount[]>([])
    const [reelsPagination, setReelsPagination] = useState<cursorPagination | null>(null)

    const navigate = useNavigate()
    const { user } = useAuth()

    function changeMode(mode: ReelsMode) {
        if (mode !== reelsMode) setReelsMode(mode)

    }

    async function uploadReel(formData: FormData) {
        try {
            setUploading(true)
            setProgress(0)
            setInterval(() => {
                if (progress < 100) {
                    setProgress(prev => prev + 10)
                }
            }, 1000)
            formData.append("userId", user!.userId)

            await uploadReelApi({ formData});
            setShowUploadForm(false)
            setLoading(true)
            await fetchReels()
            
            
        }catch(error){
            console.error(error)
            setError('Upload Failed')
        }
        finally {
            setUploading(false)
            setLoading(false)
        }
    }

    async function loadPopularTags() {
        try {
            const tags = await fetchPopularTags();
            setPopularTags(tags ?? null);
        } catch (error) {
            console.error(error);
            setError("Unable to load popular tags right now.");
            
        }
    }

    async function loadSuggestedAccounts(userId: string) {
        try {
            const accounts = await fetchSuggestedAccounts({ userId });
            setSuggestedAccounts(accounts ?? null);
        } catch (error) {
            console.error(error);
            setError("Unable to load accounts suggestions.");
        }
    }

    async function loadRecentReels() {
        setError(null)
        try {
            setLoading(true)
            const result = await fetchRecentReels({ userId: user?.userId ?? '', tag: selectedtag,cursor:reelsPagination?.cursor });
            if (reelsPagination?.cursor && result) {
                setReels([ ...reels!, ...result!.data ]);
            } else {
                setReels(result?.data ?? []);
            }
            setReelsPagination(result?.pagination ?? null)
        } catch (error) {
            console.error(error);
            setError("Unable to load reels. Please try again.");
        }
        finally {
            setLoading(false)
        }
    }

    async function loadReel(reelId: string) {
        setError(null)
        try {
            setLoading(true)
            const reels = await fetchReelById({ userId: user!.userId, reelId: reelId });
            setReels(reels ?? null)
        } catch (error) {
            console.error(error);
            setError("Unable to load reel. Please try again.");
        }
        finally {
            setLoading(false)
        }
    }

    async function loadFollowersReels() {
        setError(null)
        try {
            setLoading(true)
            const result = await fetchFollowersReels({ userId: user?.userId ?? '', tag: selectedtag,cursor: reelsPagination?.cursor });
            if (result && result.data.length > 0) {
                if (reelsPagination?.cursor) {
                    setReels([ ...reels!, ...result!.data]);
                } else {
                    setReels(result.data);
                }
                setReelsPagination(result.pagination ?? null)
            } else {
                await loadRecentReels();
            }
        } catch (error) {
            console.error(error);
            setError("Unable to load following reels. Please try again.");
        }
        finally {
            setLoading(false)
        }
    }

    async function saveReel(userId: string, reelId: string) {
        try {
            await saveReelApi(userId, reelId);
            setReels(prev =>
                prev
                    ? prev.map(r =>
                        r._id === reelId ? { ...r, isSavedByUser: !r.isSavedByUser, saveCount: r.isSavedByUser ? r.saveCount - 1 : r.saveCount + 1 } : r
                    )
                    : prev
            );
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }

    async function toggleLikeReel(
        userId: string,
        reelId: string,
        currentLiked: boolean
    ) {
        setReels(prev =>
            prev
                ? prev.map(r =>
                    r._id === reelId ? { ...r, isLikedByUser: !currentLiked, likeCount: currentLiked ? r.likeCount - 1 : r.likeCount + 1 } : r
                )
                : prev
        );

        try {
            await toggleLikeReelApi({ userId, reelId });
        } catch (err) {
            console.error(err);
            setReels(prev =>
                prev
                    ? prev.map(r =>
                        r._id === reelId ? { ...r, isLikedByUser: currentLiked, likeCount: currentLiked ? r.likeCount + 1 : r.likeCount - 1 } : r
                    )
                    : prev
            );
        }
    }


    useEffect(() => {

        if (params.id) {
            loadReel(params.id)
        }
        loadSuggestedAccounts(user!.userId)
        loadPopularTags()
    }, [])

    useEffect(() => {

        if (selectedtag) fetchReels()

    }, [selectedtag])


    useEffect(() => {

        if (reelsMode) fetchReels();

    }, [reelsMode]);


    function fetchReels() {

        if (reelsMode === "following") loadFollowersReels()
        if (reelsMode === "for-you") loadRecentReels()
        if (reelsMode === "discover") loadRecentReels()


    }

    if (loading && !reels) {
        return (
            <main className="flex flex-1 max-w-[1440px] mx-auto w-full">
                <aside className="bg-white hidden lg:flex w-64 flex-col border-slate-200 dark:border-slate-800 p-4 sticky top-[65px] h-[calc(100vh-65px)]">
                    <div className="mb-6 h-48 rounded-3xl bg-slate-100 animate-pulse dark:bg-slate-800"></div>
                    <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="h-12 rounded-2xl bg-slate-100 animate-pulse dark:bg-slate-800" />
                        ))}
                    </div>

                </aside>

                <section className="flex-1 flex flex-col md:flex-row min-w-0 overflow-hidden">
                    <div className="mb-6 h-12 w-56 rounded-full bg-slate-100 animate-pulse dark:bg-slate-800"></div>
                    <SkeletonReelGrid count={6} />
                    <SkeltonReelTagsCard />
                </section>
            </main>
        )
    }


    if (error && !reels) {
        return (
            <main className="flex flex-1 max-w-[1440px] mx-auto w-full">
                <div className="flex-1 p-4">
                    <ErrorScreen title="Could not load reels" message={error} onRetry={fetchReels} />
                </div>
            </main>
        )
    }

    return (
        <main className="flex flex-1 max-w-[1440px] mx-auto w-full">
            {uploading && <UploadProgressDialog progress={progress} />}

            {!showUploadForm && <aside className="bg-white hidden lg:flex w-64 flex-col border-slate-200 dark:border-slate-800 p-4 sticky top-[65px] h-[calc(100vh-65px)]">

                <button
                    className="my-5 flex w-full full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 bg-primary text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] hover:brightness-110 transition-all shadow-lg shadow-primary/20" onClick={() => setShowUploadForm(prev => !prev)}>
                    <span className="material-symbols-outlined">upload</span>
                    <span>Upload Reel</span>
                </button>

                <div className="flex flex-col gap-1">
                    <button className={`flex items-center gap-3 px-3 py-3 ${reelsMode === 'for-you' ? 'border-b-2 border-primary text-primary bg-primary/5' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        onClick={() => changeMode('for-you')}>
                        <span className="material-symbols-outlined">home</span>
                        <span className="font-bold">For You</span>
                    </button>
                    <button className={`flex items-center gap-3 px-3 py-3   ${reelsMode === 'following' ? 'border-b-2 border-primary text-primary bg-primary/5' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        onClick={() => changeMode('following')}>
                        <span className="material-symbols-outlined">group</span>
                        <span className="font-medium">Following</span>
                    </button>
                    <button className={`flex items-center gap-3 px-3 py-3   ${reelsMode === 'discover' ? 'border-b-2 border-primary text-primary bg-primary/5' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        onClick={() => changeMode('discover')}>
                        <span className="material-symbols-outlined">explore</span>
                        <span className="font-medium">Discover</span>
                    </button>
                </div>
                <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-6">
                    <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Suggested Accounts</p>
                    <div className="flex flex-col gap-4">
                        {
                            suggestedAccounts && suggestedAccounts.map((account) => {
                                return (
                                    <div key={account._id} className="flex items-center gap-3 px-3 cursor-pointer hover:scale-110" >

                                        <div className="size-8 rounded-full bg-slate-200 overflow-hidden">
                                            <img className="w-full h-full object-cover" data-alt="Female chef portrait" src={account.profilePhoto} />
                                        </div>
                                        <div className="flex-1 min-w-0 hover:text-primary" onClick={() => navigate(`/profile/${account._id}`)}>
                                            <p className="text-sm font-bold truncate ">{account.name}</p>

                                        </div>
                                    </div>
                                )
                            })
                        }

                    </div>
                </div>
            </aside>
            }
            <section className="flex-1 flex flex-col md:flex-row min-w-0 overflow-hidden">
                {showUploadForm ? <UploadReelForm setShowReelForm={setShowUploadForm} onSubmit={uploadReel} /> :
                    <div className="mt-6 flex-1 overflow-y-auto dark:bg-black/20 px-4 md:px-6 snap-y snap-mandatory scroll-smooth">


                        {
                            reels && reels.map((reel) => {
                                return <ReelCard key={reel._id} reel={reel} saveReel={saveReel} toggleReelLike={toggleLikeReel} />
                            })

                        }

                        {reelsPagination?.hasMore && <div className='flex items-center justify-center'>
                            <button className="px-4 py-3  mb-4 border-2 bg-white rounded-2xl border-primary text-primary font-bold text-sm hover:underline hover:scale-105" onClick={async () => loadRecentReels()}>
                                View More
                            </button>
                        </div>}

                    </div>
                }
                <div className="mr-10 mt-6 hidden xl:flex w-[380px] flex-col gap-10 rounded-2xl border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark overflow-y-auto sticky top-[0px] h-min">

                    <div className="p-6 rounded-2xl bg-primary text-white">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-white">tag</span>
                            Popular Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">

                            {
                                popularTags && popularTags.map(
                                    (tag) => {
                                        return <span key={tag._id} className={`px-3 py-1 border border-white/30 rounded-full text-sm font-medium ${selectedtag !== tag.name ? 'hover:bg-white hover:text-primary text-white' : 'hover:text-white hover:bg-primary bg-white text-primary '} cursor-pointer transition-colors`} onClick={() => { setSelectedTag(selectedtag === tag.name ? 'All' : tag.name) }}>{`#${tag.name}`}</span>

                                    }
                                )
                            }

                        </div>
                    </div>
                </div>
            </section>

        </main>
    )
}