import { useAuth } from "../../../../context/AuthContext"
import { toggleCommentLike, type ThreadComment } from "../../../../apis/community"


export function RepliesCard({ comments, onCommentsUpdated }: { comments: ThreadComment[]; onCommentsUpdated: () => void }) {
    const { user } = useAuth()

    const handleToggleLike = async (commentId: string) => {
        try {
            await toggleCommentLike(commentId)
            onCommentsUpdated()
        } catch (error) {
            console.error('Error toggling comment like:', error)
        }
    }

    return (
        <div className="space-y-6 bg-white dark:bg-slate-900/50 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800" >
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Top Replies</h2>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>Sort by:</span>
                    <button className="flex items-center gap-1 font-bold text-slate-900 dark:text-slate-100">
                        Best <span className="material-symbols-outlined text-sm">expand_more</span>
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {comments.length === 0 && <p className="text-slate-500 italic text-sm">No comments yet.</p>}
                {comments.map((comment) => (
                    <div key={comment._id} className="flex gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0">
                       <div className="w-10 h-10 rounded-full overflow-hidden" data-alt="Reviewer profile picture">
                        <img className="w-full h-full object-cover" src={comment.uid.profilePhoto} />
                    </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{comment.uid?.name || 'Anonymous'}</span>
                                <span className="text-xs text-slate-500">• {new Date(comment.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-3">
                                {comment.content}
                            </p>

                            {/* Media attachments */}
                            {comment.media && comment.media.length > 0 && (
                                <div className="mb-3 grid grid-cols-2 gap-2">
                                    {comment.media.slice(0, 4).map((media, index: number) => (
                                        <div key={media._id}>
                                            {media.type === 'image' ? (
                                                <img
                                                    src={media.url}
                                                    alt={`Attachment ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded border border-slate-200"
                                                />
                                            ) : (
                                                <video
                                                    src={media.url}
                                                    className="w-full h-24 object-cover rounded border border-slate-200"
                                                    controls
                                                />
                                            )}
                                            {comment.media && comment.media.length > 4 && index === 3 && (
                                                <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                                                    <span className="text-white text-xs">+{comment.media.length - 4}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="flex items-center gap-4">

                                <button className={`flex items-center gap-1 text-lg ${comment.likes?.includes(user?.userId ?? '') ? 'text-primary hover:text-slate-500' : 'hover:text-primary text-slate-500'}  transition-colors`}
                                    onClick={async () => await handleToggleLike(comment._id)}
                                ><span className="material-symbols-outlined text-xl">thumb_up</span> {`(${comment.likes?.length ?? 0})`}</button>
                                
                            </div>


                        </div>
                    </div>
                
                    
                ))}
        </div>
        </div >
    )
}