import type { cursorPagination } from "./restaurants"

export type Review = {
    _id: string,
    text: string,
    createdAt: string,
    restaurantId: string,
    name: string,
    user: {
        _id: string,
        username: string,
        name: string,
        profilePhoto?: string,
        level: number,
        reviewCount: number
    },
    restaurant?: { _id: string, name: string },
    photos: {
        _id: string,
        url: string
    }[],
    isLikedByUser: boolean,
    likeCount: number,
    overallRating: number

}

const API_BASE = import.meta.env.VITE_API_BASE

export async function toggleLikeReview(
    { userId, reviewId }: {
        userId: string,
        reviewId: string,

    }

): Promise<void> {


    try {
        const res = await fetch(`${API_BASE}/like/review/${reviewId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
           
            credentials: "include",
        });

        if (!res.ok) {
            throw new Error("Failed to update like");
        }


    } catch (err) {
        console.error(err);
        throw(err)

    }
}


export async function fetchReviews({ restId,limit,cursor }: { restId: string, limit:number, cursor?:string }): Promise<{data:Review[], pagination?:cursorPagination}> {
    try {
        const res = await fetch(
            `${API_BASE}/reviews/${restId}?limit=${limit}${cursor ? `&cursor=${cursor}`:""}`,
            { credentials: "include" }
        );
        if (res.ok) {
            const reviews = await res.json();
            return reviews

        }
        else {
            throw new Error('Failed to load reviews')
        }
    } catch (err) {
        console.error(err);
        throw(err)
    }
}



export async function fetchRecentReviews({ userId,limit,cursor }: { userId: string, limit:number, cursor?:string }): Promise<{data:Review[], pagination?:cursorPagination}> {
    try {
        const res = await fetch(
            `${API_BASE}/reviews/recent?userId=${userId}&limit=${limit}${cursor ? `&cursor=${cursor}`:""}`,
            { credentials: "include" }
        );
        if (!res.ok) {
            throw new Error('Failed to load reviews')
            

        }
        const result = await res.json();
          
        return result
            
        
    } catch (err) {
        console.error(err);
        throw(err)
    }
}

export async function createReview(formData: FormData): Promise<boolean> {
    try {
        const res = await fetch(`${API_BASE}/reviews/create`, {
            method: "POST",
            body: formData,
            credentials:"include"
        });

        if (!res.ok) {
            throw new Error("Failed to submit review");
        }

        return true;
    } catch (err) {
        console.error(err);
        throw(err);
    }
}



