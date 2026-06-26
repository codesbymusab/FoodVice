import { useRef, useState, useEffect } from "react";

import { useAuth } from "../../../context/AuthContext";
import { ReelCommentsSheet } from "./ReelCommentsSheet";
import { updateViews, type Reel } from "../../../apis/reels";

type ReelProps = {
    reel: Reel,
    saveReel: (userId: string, reelId: string) => Promise<false | undefined>;
    toggleReelLike: (userId: string, reelId: string, currentLiked: boolean) => Promise<void>
}
export function ReelCard({ reel, saveReel, toggleReelLike }: ReelProps) {

    const videoRef = useRef<HTMLVideoElement>(null);
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentCount, setCommentCount] = useState<number>(reel.commentCount)

    const { user } = useAuth()

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateProgress = () => {
            const percent = video.duration ? (video.currentTime / video.duration) * 100 : 0;
            setProgress(percent || 0);
        };

        video.addEventListener("timeupdate", updateProgress);
        video.addEventListener("play", () => setIsPlaying(true));
        video.addEventListener("pause", () => setIsPlaying(false));

        return () => {
            video.removeEventListener("timeupdate", updateProgress);
            video.removeEventListener("play", () => setIsPlaying(true));
            video.removeEventListener("pause", () => setIsPlaying(false));
        };
    }, []);

    function togglePlay() {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.play();
            video.muted = false
            updateView()
        } else {
            video.pause();
            video.muted = true
        }
    };

    async function updateView() {
        try {
            await updateViews({ reelId: reel._id });
        } catch (error) {
            console.error("Error tracking view:", error);
        }
    }
    return (
        <div
            className="max-w-[350px] h-screen max-h-[90vh] mx-auto mb-2 snap-start overflow-hidden"
            onMouseEnter={() => setShowButton(true)}
            onMouseLeave={() => setShowButton(false)}
        >

            <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-2xl" onClick={togglePlay} >



                <video
                    ref={videoRef}
                    src={reel.videoUrl}
                    className="absolute inset-0 w-full h-full object-cover"
                    controls={false}
                    autoPlay={false}
                    loop
                    muted
                    preload="auto"

                />


                {(!isPlaying || showButton) && <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>}


                <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="bg-accent-cyan text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                        {reel.title}
                    </span>
                    <span className="bg-black/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px] fill-current">visibility</span>
                        {reel.views}
                    </span>
                </div>


                <button
                    onClick={(e) => { e.stopPropagation(); togglePlay() }}
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-transform ${isPlaying && !showButton ? "opacity-0 hover:opacity-100" : "opacity-100"
                        }`}
                >
                    <span className="material-symbols-outlined text-4xl fill-current">
                        {isPlaying ? "pause" : "play_arrow"}
                    </span>
                </button>

                {

                    (!isPlaying || showButton) &&

                    <div className="absolute right-4 bottom-24 flex flex-col gap-6 text-white">

                        <div className="flex flex-col items-center gap-1">
                            <button className={`size-10 rounded-full  backdrop-blur-sm flex items-center justify-center ${reel.isLikedByUser ? 'bg-primary/20 hover:bg-white/20 text-primary' : 'bg-black/40 hover:text-primary text-white'}  transition-colors`} onClick={async (e) => { e.stopPropagation(); await toggleReelLike(user!.userId, reel._id, reel.isLikedByUser) }}>
                                <span className="material-symbols-outlined text-2xl">favorite</span>
                            </button>
                            <span className="text-xs font-bold">{reel.likeCount}</span>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <button className="size-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:text-accent-cyan transition-colors" onClick={(e) => { e.stopPropagation(); setShowComments(prev => !prev) }}>
                                <span className="material-symbols-outlined text-2xl">chat</span>
                            </button>
                            <span className="text-xs font-bold">{commentCount}</span>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <button className="size-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-2xl">share</span>
                            </button>
                            <span className="text-xs font-bold">2.1k</span>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <button className={`size-10 rounded-full  backdrop-blur-sm flex items-center justify-center ${reel.isSavedByUser ? 'bg-primary/20 hover:bg-white/20 text-primary' : 'bg-black/40 hover:text-primary text-white'}  transition-colors`} onClick={async (e) => { e.stopPropagation(); await saveReel(user!.userId, reel._id) }}>
                                <span className="material-symbols-outlined text-2xl">bookmark</span>
                            </button>
                            <span className="text-xs font-bold">{reel.saveCount}</span>
                        </div>
                    </div>
                }

                {

                    (!isPlaying || showButton) &&

                    <div className="absolute bottom-4 inset-x-4 flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <div className="max-w-fit rounded-full border-2 border-primary bg-white overflow-hidden">
                                <img
                                    className="w-full h-full object-cover"
                                    src={reel.user.profilePhoto}
                                    alt="User profile"
                                />
                            </div>






                            <div className="flex flex-col">
                                <h3 className="text-white font-bold text-sm">
                                    {reel.user.name}
                                    <span className="text-accent-cyan text-xs ml-1">· Follow</span>
                                </h3>
                                <p className="text-white/80 text-xs line-clamp-2">
                                    {reel.description}{" "}
                                    {reel.tags.map((tag) => `#${tag.name} `)}
                                </p>
                            </div>
                        </div>
                        <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden mt-2">
                            <div className="bg-primary h-full" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>

                }
                {showComments && <ReelCommentsSheet reelId={reel._id} setShowComments={setShowComments} setCommentCount={setCommentCount} />}

            </div>



        </div>
    );
}
