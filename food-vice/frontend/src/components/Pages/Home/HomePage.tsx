import { useEffect, useState } from 'react'
import '../../../index.css'
import { Hero } from './Sections/Hero'
// import { LatestDiscussion } from './Sections/LatestDiscussion'
// import { Leaderbaord } from './Sections/Leaderboard'
import { Nearby } from './Sections/NearBy'
import { Reels } from './Sections/Reels'
import { Reviews } from './Sections/Reviews'
import { TopRated } from './Sections/TopRated'
import { Trending } from './Sections/Trending'
import { HomeSkelton } from '../Skeltons/HomeSkelton'
import { useAppLocation } from '../../../context/LocationContext'
import { fetchCuisines } from '../../../apis/cuisines'
import { type Cuisine, type Filter } from '../Explore/ExplorePage'
import { ErrorScreen } from '../../Shared/Feedback'

export function HomePage() {

    const { location, loading, error, fetchLocation } = useAppLocation();
    const [cuisines, setCuisines] = useState<Cuisine[] | null>(null)
    const [filters, setFilters] = useState<Filter|null>({
        cuisine: 'All',
        price: "",
        rating: 0,
        dist: 50,

    })
   

    async function loadCuisines() {
        
        try {
            const result = await fetchCuisines();
            setCuisines(result);
        } catch (error) {
            console.error(error);

        }
    }

   

    useEffect(() => { loadCuisines() }, [])

    if (loading) {
        return (
            <HomeSkelton />
        )
    }

    if(!location){
        return <ErrorScreen title='Failed to Load Location' message={error!} onRetry={fetchLocation}/>
    }
    return (
        <main className="max-w-7xl mx-auto pb-20 pt-8">

            <Hero />

            <Trending />

            <Reels />

            <TopRated filters={filters} setFilters={setFilters} cuisines={cuisines} />

            <Nearby />

            {/* <section className="px-4 mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <LatestDiscussion />
                <Leaderbaord />
            </section> */}

            <Reviews />

        </main>
    )
}