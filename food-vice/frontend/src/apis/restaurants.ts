import type { Filter } from "../components/Pages/Explore/ExplorePage";

const API_BASE = import.meta.env.VITE_API_BASE

export type cursorPagination= {
        type: string,
        hasMore: boolean,
        cursor?: string,
        limit: number
}

export type TopRatedRestaurant =
    {
        _id: string,
        name: string,
        distKm: number,
        avgOverall: number,
        cuisines: string[],
        priceCategory: string,
        
        isOpen?: boolean,
        openingTime?: string
        media?: {
            _id: string,
            url: string,
        },
        latitude: number,
        longitude: number,
        isSaved: boolean
        

    }

export type RecommendedRestaurant = TopRatedRestaurant

export type TrendingRestaurant =
    {
        _id: string,
        name: string,
        distKm: number,
        avgOverall: number,
        cuisines: string[],
        priceCategory: string,
        viewCount: number,
        media?: {
            _id: string,
            url: string,
        }
    }


export async function fetchTopRatedRestaurants({ userId, filters, location,cursor }: { userId: string, filters: Filter | null, location: [number, number] | null,cursor?:string }) : Promise<{data:RecommendedRestaurant[],pagination?: cursorPagination}| undefined> {

    const searchfilters = {
        cuisine: filters?.cuisine ?? 'All',
        price: filters?.price ?? '',
        rating: filters?.rating ?? 0,
        dist: filters?.dist ?? 50
    }
    try {
        const res = await fetch(
            `${API_BASE}/restaurant/toprated?lat=${location?.[0]}&lon=${location?.[1]}&cuisine=${searchfilters.cuisine}&price=${searchfilters.price}&rating=${searchfilters.rating}&dist=${searchfilters.dist}&userId=${userId}${cursor ? `&cursor=${cursor}`:""}`,
            { credentials: "include" }
        );
        if (res.ok) {
            
            const result  = await res.json();
            
            return { data: result.data,pagination: result.pagination}

        }
    } catch (error) {
        console.error(error);
    }
}

export async function fetchTrendingRestaurants({ location,maxDistance = null }: { location: [number, number] | null ,maxDistance:number|null}) {

    
    try {
        const res = await fetch(
            `${API_BASE}/restaurant/trending?lat=${location?.[0]}&lon=${location?.[1]}&maxDistance=${maxDistance}`,
            { credentials: "include" }
        );
        if (res.ok) {
            const { details } = await res.json();
      
            return details

        }
    } catch (error) {
        console.error(error);
    }
}

export async function fetchNearbyRestaurants({ userId, filters, location }: { userId: string, filters: Filter | null, location: [number, number] | null }) {

    const searchfilters = {
        cuisine: filters?.cuisine ?? 'All',
        price: filters?.price ?? '',
        rating: filters?.rating ?? 0,
        dist: filters?.dist ?? 5
    }
    try {
        const res = await fetch(
            `${API_BASE}/restaurant/nearby?lat=${location?.[0]}&lon=${location?.[1]}&cuisine=${searchfilters.cuisine}&price=${searchfilters.price}&rating=${searchfilters.rating}&dist=${searchfilters.dist}&userId=${userId}`,
            { credentials: "include" }
        );
        if (res.ok) {
            const { details } = await res.json();

            return details

        }
    } catch (error) {
        console.error(error);
    }
}

export async function fetchRecommendedRestaurants({ userId, filters, location,cursor }: { userId: string, filters: Filter | null, location: [number, number] | null, cursor?:string })  : Promise<{data:RecommendedRestaurant[],pagination?: cursorPagination}| undefined> {
    const searchfilters = {
        cuisine: filters?.cuisine ?? 'All',
        price: filters?.price ?? '',
        rating: filters?.rating ?? 0,
        dist: filters?.dist ?? 10
    }

    try {
        const res = await fetch(
            `${API_BASE}/restaurant/recommended?lat=${location?.[0]}&lon=${location?.[1]}&cuisine=${searchfilters.cuisine}&price=${searchfilters.price}&rating=${searchfilters.rating}&dist=${searchfilters.dist}&userId=${userId}${cursor ? `&cursor=${cursor}`:""}`,
            { credentials: "include" }
        );
        if (res.ok) {
            const result  = await res.json();
           
            return { data: result.data,pagination: result.pagination}

        }
    } catch (error) {
        console.error(error);
    }
} 

export async function saveRestaurant({ userId, restId }: { userId: string, restId: string }) {

    try {
        const res = await fetch(`${API_BASE}/save/restaurant`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: userId, restId: restId }),
            credentials: "include"
        });

        if (!res.ok) {

            throw new Error('Failed to save restaurant')
        }
    }

    catch (error) {
        console.log(error)
        return false

    }

}


export async function fetchPhotos({ restId }: { restId: string }) {
    try {
        const res = await fetch(
            `${API_BASE}/restaurant/photos/${restId}`,
            { credentials: "include" }
        );
        if (res.ok) {
            const { photos } = await res.json();
            return photos
        }
        else {
            throw new Error('Failed to load photos')
        }
    } catch (error) {
        console.error(error);
    }
}

export async function fetchRestaurantDetails({ restaurantId, location, userId }: { restaurantId: string; location: [number, number] | null; userId?: string }) {
    try {
        const res = await fetch(
            `${API_BASE}/restaurant/details/${restaurantId}?lat=${location?.[0]}&lon=${location?.[1]}&userId=${userId}`,
            { credentials: "include" }
        );

        if (!res.ok) {
            throw new Error('Failed to load restaurant details');
        }

        const { details } = await res.json();
        return details;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function fetchSimilarRestaurants({ restaurantId, location }: { restaurantId: string; location: [number, number] | null }) {
    try {
        const res = await fetch(
            `${API_BASE}/restaurant/similar/${restaurantId}?lat=${location?.[0]}&lon=${location?.[1]}`,
            { credentials: "include" }
        );

        if (!res.ok) {
            throw new Error('Failed to load similar restaurants');
        }

        const { details } = await res.json();
        return details;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function updateViews({ restId,userId }: { restId: string,userId:string }) {
    try {
        await fetch(`${API_BASE}/restaurant/${restId}/view`, {
            method:"POST",
           headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: userId}),
            credentials: "include",
        });
    } catch (error) {
        console.error("Error tracking view:", error);
    }
}