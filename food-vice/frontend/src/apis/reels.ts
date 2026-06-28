import type { ReelComment } from "../components/Pages/Reels/ReelCommentsSheet"
import type { cursorPagination } from "./restaurants"

export type ReelsMode = 'for-you' | 'following' | 'discover'
export type ReelTag = {

    _id: string,
    name: string

}
export type Reel = {

    _id: string,
    title: string,
    description: string,
    tags:
    ReelTag[]
    ,
    createdAt: string,
    user: {
        _id: string,
        name: string,
        username: string,
        profilePhoto?: string
    },
    likeCount: number,
    commentCount: number,
    saveCount: number,
    isLikedByUser: boolean,
    videoUrl: string,
    isSavedByUser: boolean,
    views: number

}


export type SuggestedAccount = {

    _id: string,
    name: string,
    profilePhoto?: string
}

const API_BASE = import.meta.env.VITE_API_BASE

export async function fetchRecentReels({ userId, tag, cursor }: { userId: string, tag: string | null, cursor?:string }):Promise<{data:Reel[],pagination?: cursorPagination}>{
    try {

        const res = await fetch(
            `${API_BASE}/reels/recent/reels?userId=${userId}&tag=${tag ?? 'All'}${cursor ? `&cursor=${cursor}`:""}`,
            { credentials: "include" }
        );
        if (res.ok) {
            const reels = await res.json();
            return reels

        }
        else {
            throw new Error('Failed to load recent reels')
        }
    } catch (error) {
        console.error(error);
        throw error
    }

}

export async function fetchReelById({ reelId, userId }: { userId: string, reelId: string }): Promise<Reel[]> {
    try {

        const res = await fetch(
            `${API_BASE}/reels/reel/${reelId}/${userId}`,
            { credentials: "include" }
        );
        if (res.ok) {
            const reel = await res.json();
          
            return reel

        }
        else {
            throw new Error('Failed to load reel')
        }
    } catch (error) {
        console.error(error);
        throw error
    }

}


export async function updateViews({ reelId }: { reelId: string }): Promise<void> {
    try {
        await fetch(`${API_BASE}/reels/${reelId}/view`, {
            method: "POST",
            credentials: "include"
        });
    } catch (error) {
        console.error("Error tracking view:", error);
        throw error
    }
}


export async function fetchComments({ userId, reelId }: { userId: string, reelId: string }): Promise<ReelComment[]> {
    try {
        const res = await fetch(
            `${API_BASE}/comments/${reelId}?userId=${userId}`,
            {credentials: "include"}
        );
        if (res.ok) {
            const data = await res.json();
            return data
        } else {
            throw new Error("Failed to load comments");
        }
    } catch (error) {
        console.error("Error fetching comments:", error);
        throw error
    }
}

export async function postComment({ reelId, userId, newComment }: { reelId: string, userId: string, newComment: string }): Promise<void> {
    if (!newComment.trim()) return;
    try {
        const res = await fetch(`${API_BASE}/comments/${reelId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: userId, text: newComment }),
            credentials: "include"
        });
        if (!res.ok) throw new Error("Failed to post comment");


    } catch (error) {
        console.error("Error posting comment:", error);
        throw error
    }
}

export async function toggleCommentLike({ commentId, userId }: { commentId: string, userId: string }): Promise<void> {
    try {
        const res = await fetch(`${API_BASE}/like/reel/comment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ commentId, userId: userId }),
            credentials: "include"
        });
        if (!res.ok) throw new Error("Failed to toggle comment like");

    } catch (error) {
        console.error("Error toggling comment like:", error);
        throw error
    }
}



export async function uploadReel({ formData}: { formData: FormData }): Promise<void> {
    try {
        
        
        const response = await fetch(`${API_BASE}/reels/upload`, {
            method: "POST",
            body: formData,
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Upload failed");
        }

        await response.json();

    } catch (err) {
        console.error("Error uploading reel:", err);
        throw err
    }
}

export async function fetchPopularTags(): Promise<ReelTag[]> {
    try {

        const res = await fetch(
            `${API_BASE}/reels/tags/popular`,
            { credentials: "include" }
        );
        if (res.ok) {
            const tags = await res.json();
            return tags
        }
        else {
            throw new Error('Failed to load tags')
        }
    } catch (error) {
        console.error(error);
        throw error
    }

}

export async function fetchSuggestedAccounts({ userId }: { userId: string }): Promise<SuggestedAccount[]> {
    try {

        const res = await fetch(
            `${API_BASE}/reels/suggestions/accounts?userId=${userId}`,
            { credentials: "include" }
        );
        if (res.ok) {
            const { suggestions } = await res.json();
            return suggestions
        }
        else {
            throw new Error('Failed to load tags')
        }
    } catch (error) {
        console.error(error);
        throw error
    }

}



export async function fetchFollowersReels({ userId, tag, cursor }: { userId: string, tag: string | null, cursor?:string }):Promise<{data:Reel[],pagination?: cursorPagination}> {
    try {

        const res = await fetch(
            `${API_BASE}/reels/followers/reels?userId=${userId}&tag=${tag ?? 'All'}${cursor ? `&cursor=${cursor}`:""}`,
            { credentials: "include" }
        );
        if (res.ok) {
            const reels = await res.json();

            return reels;

        }
        else {
            throw new Error('Failed to load followers reels')
        }
    } catch (error) {
        console.error(error);
        throw error
    }

}

export async function saveReel(userId: string, reelId: string): Promise<void | false> {

    try {
        const res = await fetch(`${API_BASE}/save/reel`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: userId, reelId: reelId }),
            credentials: "include"
        });

        if (!res.ok) {

            throw new Error('Failed to save reel')
        }
    }
    catch (error) {
        console.error(error)
        return false

    }

}

export async function toggleLikeReel({ userId, reelId }: {
    userId: string,
    reelId: string,

}

): Promise<void> {



    try {
       
        const res = await fetch(`${API_BASE}/like/reel`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: userId, reelId: reelId }),
            credentials: "include",
        });
      
        if (!res.ok) {
            throw new Error("Failed to update like");
        }

    } catch (err) {
        console.error(err);
        throw err
    }
}



export async function fetchReels({ reelId }: { reelId: string }): Promise<Reel[]> {
    try {
        const res = await fetch(
            `${API_BASE}/restaurant/reels/${reelId}`,
            { credentials: "include" }
        );
        if (res.ok) {
            const { reels } = await res.json();
            return reels
        }
        else {
            throw new Error('Failed to load Reels')
        }
    } catch (error) {
        console.error(error);
        throw error
    }
}