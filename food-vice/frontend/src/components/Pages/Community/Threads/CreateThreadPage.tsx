import { useState, useEffect, type ChangeEvent } from "react"
import { useNavigate, useParams } from "react-router"
import { CommunityGuidelines } from "../CommunityGuidelinesCard"
import { CommunityCover } from "../CommunityCover"
import { API_BASE, createThread, getTopics, type Community, type Topic } from "../../../../apis/community"

export function CreateThreadPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [community, setCommunity] = useState<Community|null>(null)
    const [mediaFiles, setMediaFiles] = useState<File[]>([])
    const [mediaPreviews, setMediaPreviews] = useState<string[]>([])
    const [selectedTopics, setSelectedTopics] = useState<string[]>([])
    const [availableTopics, setAvailableTopics] = useState<Topic[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        
        if (id) {
            fetchCommunityDetails()
        }
    }, [id])

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const topics = await getTopics()
                setAvailableTopics(topics)
            } catch (error) {
                console.error('Error fetching topics:', error)
            }
        }
        fetchTopics()
    }, [])

    const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        setMediaFiles(prev => [...prev, ...files])
        
        files.forEach(file => {
            const reader = new FileReader()
            reader.onloadend = () => {
                setMediaPreviews(prev => [...prev, reader.result as string])
            }
            reader.readAsDataURL(file)
        })
    }

    const removeMedia = (index: number) => {
        setMediaFiles(prev => prev.filter((_, i) => i !== index))
        setMediaPreviews(prev => prev.filter((_, i) => i !== index))
    }

    const toggleTopic = (topicId: string) => {
        setSelectedTopics(prev => 
            prev.includes(topicId) 
                ? prev.filter(id => id !== topicId)
                : [...prev, topicId]
        )
    }

    const fetchCommunityDetails = async () => {
        try {
            const response = await fetch(`${API_BASE}/community/${id}`, { credentials: 'include' })
            const data = await response.json()
            setCommunity(data)
        } catch (error) {
            console.error('Error fetching community details:', error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
      
        try {
            await createThread({
                communityId: id!,
                title,
                content,
                topics: selectedTopics,
                media: mediaFiles
            })
            navigate(`/community/${id}`)
        } catch (error) {
            console.error('Error creating thread:', error)
            alert('Failed to create thread')
        } finally {
            setLoading(false)
        }
    }

    if (!community) return <div className="p-10 text-center">Loading Community...</div>

    return (
        <main className="flex-grow px-4 md:px-10 py-8 max-w-7xl mx-auto">
            <CommunityCover community={community} />

            <div className="mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                <div className="bg-white lg:col-span-8">
                    <div className="bg-surface rounded-xl shadow-2xl shadow-orange-500/5 p-8 md:p-12 border border-outline-variant/30">
                        <div className="mb-10">
                            <span className="text-accent-cyan font-bold uppercase tracking-widest text-xs">New Thread</span>
                            <h1 className="text-4xl font-black text-on-surface mt-2 tracking-tight">Share Your Culinary Find</h1>
                            <p className="text-on-surface-variant mt-2 text-lg">The Urban Epicurean thrives on shared secrets. What's on the menu today?</p>
                        </div>
                        <form className="space-y-10" onSubmit={handleSubmit}>

                            <div className="space-y-2">
                                <div className="flex items-center gap-3 mb-2 ml-4">
                                    <span className="p-2 bg-accent-cyan/20 text-accent-cyan rounded-full shrink-0 flex items-center justify-center w-10 h-10">
                                        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1;" }}>title</span>
                                    </span>
                                    <label className="text-xl font-bold tracking-tight">Title</label>
                                </div>
                                <input 
                                    className="w-full px-6 py-4 rounded-xl border-outline bg-gray-100 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" 
                                    placeholder="e.g. The best hidden ramen spot in Neo-Tokyo..." 
                                    type="text" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="">
                                <div className="flex justify-between items-center  mb-2">
                                    <div className="flex items-center gap-3 mb-2 ml-4">
                                        <span className="p-2 bg-accent-cyan/20 text-accent-cyan rounded-full shrink-0 flex items-center justify-center w-10 h-10">
                                            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1;" }}>edit_note</span>
                                        </span>
                                        <label className="text-xl font-bold tracking-tight">Details</label>
                                    </div>
                                    <div className="flex gap-2 text-stone-400">
                                        <span className="material-symbols-outlined text-lg cursor-pointer hover:text-primary transition-colors">format_bold</span>
                                        <span className="material-symbols-outlined text-lg cursor-pointer hover:text-primary transition-colors">format_italic</span>
                                        <span className="material-symbols-outlined text-lg cursor-pointer hover:text-primary transition-colors">link</span>
                                        <span className="material-symbols-outlined text-lg cursor-pointer hover:text-primary transition-colors">format_list_bulleted</span>
                                        <span className="material-symbols-outlined text-lg cursor-pointer hover:text-primary transition-colors">image</span>
                                    </div>
                                </div>
                                <textarea 
                                    className="w-full px-6 py-4 rounded-xl border-outline bg-gray-100 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none resize-none" 
                                    placeholder="Describe the atmosphere, the seasoning, the soul of the dish..." 
                                    rows={6}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-3 mb-2 ml-4">
                                    <span className="p-2 bg-accent-cyan/20 text-accent-cyan rounded-full shrink-0 flex items-center justify-center w-10 h-10">
                                        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1;" }}>image</span>
                                    </span>
                                    <label className="text-xl font-bold tracking-tight">Visual Feast (Optional)</label>
                                </div>
                                <div className="space-y-4">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*,video/*"
                                        onChange={handleMediaChange}
                                        className="w-full px-6 py-4 rounded-xl border-outline bg-gray-100 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                                    />
                                    
                                    {/* Media previews */}
                                    {mediaPreviews.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {mediaPreviews.map((preview, index) => (
                                                <div key={index} className="relative group">
                                                    {mediaFiles[index]?.type.startsWith('image/') ? (
                                                        <img 
                                                            src={preview} 
                                                            alt={`Preview ${index + 1}`}
                                                            className="w-full h-32 object-cover rounded-lg border border-slate-200"
                                                        />
                                                    ) : (
                                                        <video 
                                                            src={preview} 
                                                            className="w-full h-32 object-cover rounded-lg border border-slate-200"
                                                            controls
                                                        />
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeMedia(index)}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">close</span>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-3 mb-2 ml-4">
                                    <span className="p-2 bg-accent-cyan/20 text-accent-cyan rounded-full shrink-0 flex items-center justify-center w-10 h-10">
                                        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1;" }}>topic</span>
                                    </span>
                                    <label className="text-xl font-bold tracking-tight">Topics (Optional)</label>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {availableTopics.map((topic) => (
                                        <button
                                            key={topic._id}
                                            type="button"
                                            onClick={() => toggleTopic(topic._id)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                                selectedTopics.includes(topic._id)
                                                    ? 'bg-primary text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {topic.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button 
                                    className="w-full py-4 rounded-xl bg-primary text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50" 
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Publishing...' : 'Publish'}
                                </button>
                                <button 
                                    className="w-full py-4 rounded-xl border-2 border-stone-100 text-stone-500 font-black uppercase tracking-widest text-xs hover:bg-red-200/70 active:scale-95 hover:scale-[1.02] transition-all" 
                                    type="button"
                                    onClick={() => navigate(`/community/${id}`)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>

                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8 md:mr-12">
                    <CommunityGuidelines guidelines={community.guidelines} />
                </div>
            </div>
        </main>
    )
}
