export type Review = {
    _id: string,
    text: string,
    createdAt: string,
    restaurantId: string,
    name: string,
    user: {
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

) {


    try {
        const res = await fetch(`${API_BASE}/like/review`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: userId, reviewId: reviewId }),
            credentials: "include",
        });

        if (!res.ok) {
            throw new Error("Failed to update like");
        }


    } catch (err) {
        console.error(err);


    }
}


export async function fetchReviews({ restId }: { restId: string }) {
    try {
        const res = await fetch(
            `${API_BASE}/reviews/${restId}`,
            { credentials: "include" }
        );
        if (res.ok) {
            const reviews = await res.json();
            return reviews

        }
        else {
            throw new Error('Failed to load reviews')
        }
    } catch (error) {
        console.error(error);
    }
}



export async function fetchRecentReviews({ userId }: { userId: string }) {
    try {
        const res = await fetch(
            `${API_BASE}/reviews/recent?userId=${userId}`,
            { credentials: "include" }
        );
        if (res.ok) {
            const reviews = await res.json();
          
            return reviews

        }
        else {
            throw new Error('Failed to load reviews')
        }
    } catch (error) {
        console.error(error);
    }
}

export async function createReview(formData: FormData) {
    try {
        const res = await fetch(`${API_BASE}/reviews/create`, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            throw new Error("Failed to submit review");
        }

        return true;
    } catch (err) {
        console.error(err);
        throw err;
    }
}



