import { RestaurantCard, type RecommendedRestaurant, type TopRatedRestaurant } from './RestaurantCard';
import { FiltersSidebar } from './FiltersSidebar';
import { useEffect, useState } from 'react';
import ExploreMapView from './ExploreMapView';
import { useAuth } from '../../../context/AuthContext';
import { useAppLocation } from '../../../context/LocationContext';
import { ErrorScreen, SkeletonRestaurantGrid, OperationLoadingDialog } from '../../Shared/Feedback';
import { fetchTopRatedRestaurants as loadTopRatedRestaurantsAPI, fetchRecommendedRestaurants as loadRecommendedRestaurantsAPI, type cursorPagination } from '../../../apis/restaurants';
import { fetchCuisines } from '../../../apis/cuisines';
import { SearchBar } from '../../SearchBar';
import { ExploreChatBot } from './ExploreChatBot';
import { fetchAIRecommendations, type AIRecommendation } from '../../../apis/ai';
import { Outlet, useNavigate, useParams } from 'react-router';

export type Cuisine = {
  _id: string,
  name: string

}
export type Filter = {
  cuisine?: string,
  price?: string,
  rating?: number,
  dist?: number
}
function ExplorePage() {

  const { user } = useAuth()
  const { location, loading: locationLoading, error: locationError, fetchLocation } = useAppLocation();
  const [topRatedRestaurants, setTopRatedRestaurants] = useState<TopRatedRestaurant[]>([]);
  const [recommendedRestaurants, setRecommendedRestaurants] = useState<RecommendedRestaurant[]>([]);
  const [topRatedPagination,setTopRatedPagination]=useState<cursorPagination|null>(null)
  const [recommendedPagination,setRecommendedPagination]=useState<cursorPagination|null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [aiRecommendations, setAIRecommendations] = useState<AIRecommendation[]>([]);
  const [aiLoading, setAILoading] = useState<boolean>(false);
  const [aiError, setAIError] = useState<string | null>(null);
  const [mapView, setMapView] = useState<boolean>(false)
  const [cuisines, setCuisines] = useState<Cuisine[]>([])
  const [filters, setFilters] = useState<Filter>({
    cuisine: 'All',
    price: "",
    rating: 0,
    dist: 50,

  })
  const [applyingFilters, setApplyingFilters] = useState<boolean>(false);
  const navigate= useNavigate()
  const params=useParams()
  
  async function loadTopRatedRestaurants(location: [number, number] | null) {
    try {
      const result = await loadTopRatedRestaurantsAPI({ userId: user?.userId ?? '', filters, location });
      if(topRatedPagination?.cursor && result){
        setTopRatedRestaurants([...recommendedRestaurants!,...result!.data])
      }
      else{
        setTopRatedRestaurants(result?.data ?? []);
      }
      setTopRatedPagination(result?.pagination ?? null) 
    } catch (error) {
      console.error(error);
      setError("Unable to load top rated restaurants. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function loadRecommendedRestaurants(location: [number, number] | null) {
    try {
      
      const result= await loadRecommendedRestaurantsAPI({ userId: user?.userId ?? '', location, filters: null,cursor: recommendedPagination?.cursor})
      if(recommendedPagination?.cursor && result){
        setRecommendedRestaurants([...recommendedRestaurants!,...result!.data])
      }
      else{
        setRecommendedRestaurants(result?.data ?? [])
      }
      setRecommendedPagination(result?.pagination ?? null) 
    } catch (error) {
      console.error(error);
      setError("Unable to load recommended restaurants. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function loadCuisines() {
    try {
      const result = await fetchCuisines();
      setCuisines(result);
    } catch (error) {
      console.error(error);
    }
  }


  useEffect(() => {
    loadCuisines();
  }, []);

  useEffect(() => {
    if (!locationLoading) {
      setLoading(true);
      setError(null);
      void Promise.all([loadTopRatedRestaurants(location), loadRecommendedRestaurants(location)]);
    }
  }, [locationLoading, location]);


  async function applyFilters() {
    setApplyingFilters(true);
    setLoading(true);
    setError(null);
    await Promise.all([loadTopRatedRestaurants(location), loadRecommendedRestaurants(location)]);
    setApplyingFilters(false);
  }

  async function loadAIRecommendations() {
    if (!searchQuery.trim()) {
      setAIRecommendations([]);
      setAIError(null);
      return;
    }

    if (!location) {
      setAIError('Location is required for AI recommendations.');
      setAIRecommendations([]);
      return;
    }

    try {
      setAILoading(true);
      setAIError(null);
      const results = await fetchAIRecommendations({
        query: searchQuery.trim(),
        location,
        userId: user?.userId,
      });
      setAIRecommendations(results);
      if (!results || results.length === 0) {
        setAIError('No AI recommendations were found for that query.');
      }
    } catch (error) {
      console.error(error);
      setAIRecommendations([]);
      setAIError('Unable to fetch AI recommendations.');
    } finally {
      setAILoading(false);
    }
  }

  const displayError = error ?? locationError;

  if (locationLoading && !topRatedRestaurants && !recommendedRestaurants) {
    return (
      <main className="flex flex-1 min-h-[calc(100vh-80px)] p-4">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <div className="h-12 w-3/4 rounded-full bg-slate-200 animate-pulse dark:bg-slate-800"></div>
          <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-100 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="h-10 w-1/2 rounded-full bg-slate-200 animate-pulse dark:bg-slate-700"></div>
              <div className="h-4 rounded-full bg-slate-200 animate-pulse dark:bg-slate-700"></div>
              <div className="h-4 rounded-full bg-slate-200 animate-pulse dark:bg-slate-700"></div>
            </div>
            <div className="space-y-4">
              <SkeletonRestaurantGrid count={3} />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if(params.id){
    return <Outlet />
  }
  return (
    <>

      <main className="flex flex-1">

        <FiltersSidebar cuisines={cuisines} filters={filters} setFilters={setFilters} applyFilters={applyFilters} />


        <section className="flex-1 flex flex-col p-4 gap-8 overflow-y-auto max-w-[1200px] mx-auto w-full">
          {displayError ? (
            <div className="mb-6">
              <ErrorScreen title="Unable to load explore content" message={displayError} onRetry={() => void fetchLocation()} />
            </div>
          ) : null}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Discover Delicious</h1>
              <p className="text-slate-500 font-medium">Top picks for your cravings in your Area</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setMapView((prev) => !prev)} className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                {!mapView ? (
                  <><span className="material-symbols-outlined text-xl">map</span>
                    <span>View on Map</span></>

                ) : (
                  <><span className="material-symbols-outlined text-xl">list</span>
                    <span>View List</span></>

                )}
              </button>
            </div>
          </div>

          {!mapView ?
            <>
              <div className="space-y-6">

                <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
                  <SearchBar placeHolder="Search nearby restaurants, cuisine, or mood" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  <button onClick={() => void loadAIRecommendations()} className="my-1 rounded-full bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary-dark transition-all">
                    Search AI
                  </button>
                </div>
                {searchQuery.trim() ? (
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">auto_awesome</span>
                        AI Recommendations
                      </h2>
                    </div>
                    {aiLoading ? (
                      <p className="text-sm text-slate-500">Fetching AI recommendations...</p>
                    ) : aiError ? (
                      <p className="text-sm text-red-500">{aiError}</p>
                    ) : null}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {aiRecommendations?.map((item) => (
                        <div key={item.id} className="hover:cursor-pointer hover:border-2 hover:border-primary rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all" onClick={()=>navigate(`/explore/restaurant/${item.id}`)}>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <div>
                              <h3 className="font-bold text-lg">{item.name}</h3>
                              <p className="text-sm text-slate-500">{item.cuisine} • {item.priceCategory}</p>
                            </div>
                            <span className="text-sm font-semibold text-primary">{item.distanceKm.toFixed(1)} km</span>
                          </div>
                          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{item.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">lightbulb</span>
                    Recommendations
                  </h2>
                 
                </div>
                {loading ? (
                  <SkeletonRestaurantGrid count={3} />
                ) : (
                  <div className="overflow-x-auto grid-rows-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {recommendedRestaurants && recommendedRestaurants.map((restaurant) => {
                      return <RestaurantCard key={restaurant._id} restaurant={restaurant} setTopRatedRestaurants={setRecommendedRestaurants} />
                    })}
                  </div>
                )}
                {recommendedPagination?.hasMore && <div className='flex items-center justify-center'>
                  <button className="px-4 py-3  border-2 bg-white rounded-2xl border-primary text-primary font-bold text-sm hover:underline hover:scale-105" onClick={async ()=>loadRecommendedRestaurants(location)}>
                    View More
                  </button>
                </div>}
                
              </div>

              <div className="space-y-6 pt-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">award_star</span>
                    Top Rated Near You
                  </h2>
                 
                </div>
                {loading ? (
                  <SkeletonRestaurantGrid count={3} />
                ) : (
                  <div className="grid grid-cols-1 grid-rows-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 overflow-x-auto">
                    {recommendedRestaurants ?
                      topRatedRestaurants && topRatedRestaurants
                        .filter(
                          top =>
                            !recommendedRestaurants.some(
                              rec => rec._id.toString() === top._id.toString()
                            )
                        )
                        .map(restaurant => (
                          <RestaurantCard
                            key={restaurant._id}
                            restaurant={restaurant}
                            setTopRatedRestaurants={setTopRatedRestaurants}
                          />
                        ))
                      :
                      topRatedRestaurants && topRatedRestaurants.map(restaurant => (
                        <RestaurantCard
                          key={restaurant._id}
                          restaurant={restaurant}
                          setTopRatedRestaurants={setTopRatedRestaurants}
                        />
                      ))}
                  </div>
                  
                )}
                 {topRatedPagination?.hasMore && <div className='flex items-center justify-center'>
                  <button className="px-4 py-3  border-2 bg-white rounded-2xl border-primary text-primary font-bold text-sm hover:underline hover:scale-105" onClick={async ()=>loadTopRatedRestaurants(location)}>
                    View More
                  </button>
                </div>}
              </div>
            </>
            :

            <ExploreMapView topRatedRestaurants={topRatedRestaurants!} location={location} />
          }
        </section>


      </main>
      <ExploreChatBot location={location} userId={user?.userId} />
      {applyingFilters && <OperationLoadingDialog message="Applying filters..." />}
    
    </>
  );
};

export default ExplorePage;