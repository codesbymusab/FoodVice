import type { Cuisine } from "../components/Pages/Explore/ExplorePage";

const API_BASE = import.meta.env.VITE_API_BASE

export async function fetchCuisines(): Promise<Cuisine[]> {
    try {
        const res = await fetch(`${API_BASE}/restaurant/cuisines`, {
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error('Failed to load cuisines');
        }

        const data = await res.json();
        return data.result;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}
