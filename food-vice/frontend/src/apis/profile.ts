import type { UserProfile } from "../components/Pages/Profile/UserProfilePage";
import type { Restaurant } from "../components/Pages/RestaurantDetail/RestaurantDetailPage";
import type { Reel } from "./reels";
import type { cursorPagination } from "./restaurants";
import type { Review } from "./reviews";

const API_BASE = import.meta.env.VITE_API_BASE

export type UserReels={
    saved: Reel[],
    user:Reel[]
}

export async function fetchUserProfile(userId: string): Promise<UserProfile> {
    try {
        const res = await fetch(`${API_BASE}/user/profile/${userId}`, {
            credentials: "include",
        });

        if (!res.ok) {
            throw new Error("Failed to load user profile");
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

export async function fetchSavedRestaurants(userId: string): Promise<Restaurant[]> {
    try {
        const res = await fetch(`${API_BASE}/restaurant/saved?userId=${userId}`, {
            credentials: "include",
        });

        if (!res.ok) {
            throw new Error("Failed to load saved restaurants");
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

export async function fetchUserReels(userId: string):Promise<{saved:{data:Reel[]; pagination?:cursorPagination}; user:{data:Reel[]; pagination?:cursorPagination}}> {
    try {
        const res = await fetch(`${API_BASE}/reels/${userId}`, {
            credentials: "include",
        });

        if (!res.ok) {
            throw new Error("Failed to load user reels");
        }

        const result = await res.json();
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function fetchUserReviews(userId: string):Promise<{data:Review[]; pagination?:cursorPagination}> {
    try {
        const res = await fetch(`${API_BASE}/reviews/user/${userId}`, {
            credentials: "include",
        });

        if (!res.ok) {
            throw new Error("Failed to load user reviews");
        }

        const result = await res.json();
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function editUserProfile(formData: FormData): Promise<UserProfile> {
    try {
        const res = await fetch(`${API_BASE}/user/edit`, {
            method: "PUT",
            body: formData,
            credentials: "include",
        });

        if (!res.ok) {
            throw new Error("Failed to update profile");
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
