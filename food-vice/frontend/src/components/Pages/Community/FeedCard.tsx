import { useNavigate } from "react-router"
import { likeThread, dislikeThread, type Thread } from "../../../apis/community"
import { useAuth } from "../../../context/AuthContext"



export function FeedCard({ thread, onUpdate }: { thread: Thread, onUpdate?: () => void }) {
    const navigate = useNavigate()
    const { user } = useAuth()

   
    function goToDetailsPage() {
        if (thread) {
            navigate(`/community/${thread.communityId}/${thread._id}`)
        }
    }

    const isLikedByUser = user ? thread.likes.includes(user.userId) : false
    const isDislikedByUser = user ? thread.dislikes.includes(user.userId) : false

    const handleLike = async () => {
        try {
            await likeThread(thread._id)
            if (onUpdate) onUpdate()
        } catch (error) {
            console.error('Error liking thread:', error)
        }
    }

    const handleDislike = async () => {
        try {
            await dislikeThread(thread._id)
            if (onUpdate) onUpdate()
        } catch (error) {
            console.error('Error disliking thread:', error)
        }
    }

    return (
        <article
            className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex gap-6">
                <div className="flex flex-col items-center gap-1">
                    <button
                        className={`p-1 rounded transition-colors ${isLikedByUser ? 'bg-primary/20 text-primary' : 'hover:bg-primary/10 text-slate-500'}`}
                        onClick={handleLike}
                    >
                        <span className="material-symbols-outlined">expand_less</span>
                    </button>
                    <span className="text-base font-bold">{(thread.likes?.length || 0) - (thread.dislikes?.length || 0)}</span>
                    <button
                        className={`p-1 rounded transition-colors ${isDislikedByUser ? 'bg-red-500/20 text-red-500' : 'hover:bg-red-500/10 text-red-500'}`}
                        onClick={handleDislike}
                    >
                        <span className="material-symbols-outlined">expand_more</span>
                    </button>
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">


                        <div className="w-10 h-10 rounded-full overflow-hidden" data-alt="Reviewer profile picture">
                        <img className="w-full h-full object-cover" src={thread.uid.profilePhoto} />
                    </div>

                        <span className="text-sm font-semibold">@{thread.uid?.name || 'anonymous'}</span>
                        <span className="text-xs text-slate-500">• {new Date(thread.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h2 className="text-xl font-bold mb-2 hover:text-primary cursor-pointer transition-colors" onClick={goToDetailsPage}>
                        {thread.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                        {thread.content}
                    </p>

                    {/* Media attachments */}
                    {thread.media && thread.media.length > 0 && (
                        <div className="mb-4 grid grid-cols-2 gap-2">
                            {thread.media.slice(0, 4).map((media,index) => (
                                <div key={media._id} className="relative">
                                    {media.type === 'image' ? (
                                        <img
                                            src={media.url}
                                            alt={`Attachment ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                                        />
                                    ) : (
                                        <video
                                            src={media.url}
                                            className="w-full h-32 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                                            controls
                                        />
                                    )}
                                    {thread.media && thread.media.length > 4 && index === 3 && (
                                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-bold">+{thread.media.length - 4} more</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-6">
                        <button
                            className="flex items-center gap-2 text-slate-500 hover:text-primary text-sm font-medium transition-colors"
                            onClick={goToDetailsPage}
                        >
                            <span className="material-symbols-outlined text-lg">chat_bubble_outline</span> Comments
                        </button>
                        <button
                            className="flex items-center gap-2 text-slate-500 hover:text-primary text-sm font-medium transition-colors">
                            <span className="material-symbols-outlined text-lg">share</span> Share
                        </button>
                    </div>
                </div>
            </div>
        </article>
    )
}