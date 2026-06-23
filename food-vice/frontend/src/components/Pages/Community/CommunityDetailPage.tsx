import { FeedCard } from "./FeedCard";
import { SearchBar } from "../../SearchBar";
import { useNavigate, useParams } from "react-router";
import { CommunityGuidelines } from "./CommunityGuidelinesCard";
import { CommunityCover } from "./CommunityCover";
import { TopicsCard } from "./TopicsCard";
import { useState, useEffect } from "react";
import { API_BASE, getThreadsByCommunity, type Community, type Thread } from "../../../apis/community";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

export function CommunityDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [community, setCommunity] = useState<Community|null>(null)
    const [threads, setThreads] = useState<Thread[]|null>([])
    const [isMember, setIsMember] = useState(false)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedTopic, setSelectedTopic] = useState<string>('all')
    const { user } = useAuth()
    useEffect(() => {
        if (id) {
            fetchCommunityDetails()
            fetchThreads()
            checkMembership()
        }
    }, [id])

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchThreads()
        }, 300)

        return () => clearTimeout(delayDebounceFn)
    }, [searchQuery, selectedTopic])

    const fetchCommunityDetails = async () => {
        try {
            const response = await axios.get(`${API_BASE}/community/${id}`, { withCredentials: true })
            setCommunity(response.data)
        } catch (error) {
            console.error('Error fetching community details:', error)
        }
    }

    const checkMembership = async () => {
        try {
            const response = await axios.get(`${API_BASE}/community/joined?userId=${user?.userId}`, { withCredentials: true })
            const joined = response.data.some((c: {_id:string}) => c._id === id)
            setIsMember(joined)
        } catch (error) {
            console.error('Error checking membership:', error)
        }
    }

    const handleJoin = async () => {
        try {
            await axios.post(`${API_BASE}/community/${id}/join`, {}, { withCredentials: true })
            setIsMember(true)
        } catch (error) {
            console.error('Error joining community:', error)
           
        }
    }

    const fetchThreads = async () => {
        try {
            if (id) {
                const topicIds = selectedTopic !== 'all' ? [selectedTopic] : []
                const fetchedThreads = await getThreadsByCommunity(id, searchQuery, topicIds)
                setThreads(fetchedThreads)
            }
        } catch (error) {
            console.error('Error fetching threads:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="p-10 text-center">Loading Community...</div>
    if (!community) return <div className="p-10 text-center text-red-500">Community not found</div>

    return (
        <main className="flex-1 px-4 md:px-10 py-8 max-w-7xl mx-auto">

            <CommunityCover community={community} />

            <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                <aside className="lg:col-span-3 flex flex-col gap-6 order-2 lg:order-1">

                    {isMember ?

                        <button
                            className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 border-2 border-primary text-white bg-primary gap-2 text-base font-bold leading-normal tracking-[0.015em] hover:brightness-110 transition-all shadow-lg shadow-primary/20"
                            onClick={() => navigate(`/community/${id}/create-thread`)}
                        >
                            <span className="material-symbols-outlined">add</span>
                            <span>Create Thread</span>
                        </button>
                        :
                        <div className="bg-primary rounded-xl p-6 text-white shadow-2xl shadow-primary/40 border border-white/20">
                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined">groups</span>
                                Join {community.name}
                            </h3>
                            <p className="text-primary-100 text-sm leading-normal mb-4">
                                Become a member to post threads and interact with others!
                            </p>
                            <button
                                className="w-full py-3 bg-white text-primary font-black uppercase tracking-widest text-xs rounded-xl hover:bg-slate-100 transition-all active:scale-95 shadow-lg"
                                onClick={handleJoin}
                            >
                                Join Community
                            </button>
                        </div>
                    }



                    <TopicsCard selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />

                    <CommunityGuidelines guidelines={community.guidelines} />

                </aside>

                <div className="lg:col-span-9 order-1 lg:order-2 flex flex-col gap-6">
                    <SearchBar
                        placeHolder="Search for threads..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <div className="flex flex-col gap-4">
                        {threads && threads.length === 0 ? <p className="text-center py-10 text-slate-500 italic">By default no threads. Be the first to start a conversation!</p>
                        : threads && threads.map((thread) => (
                            <FeedCard key={thread._id} thread={thread} onUpdate={fetchThreads} />
                        ))}
                    </div>


                </div>
            </div>

           
        </main>
    )
}
