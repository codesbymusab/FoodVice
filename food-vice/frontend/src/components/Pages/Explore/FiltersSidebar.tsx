import type { Cuisine, Filter } from "./ExplorePage";

type FiltersSidebarProps = { cuisines: Cuisine[], filters: Filter, setFilters: React.Dispatch<React.SetStateAction<Filter>>, applyFilters: () => Promise<void> }


export function FiltersSidebar({ cuisines, filters, setFilters, applyFilters}: FiltersSidebarProps) {
    return (
        <aside className="hidden lg:flex w-72 flex-col border-r border-primary/10 bg-white dark:bg-background-dark p-6 gap-8 sticky top-[65px] h-[calc(100vh-65px)] overflow-y-auto">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">Filters</h3>
                    <div >
                        <button className="mr-1 text-xs font-semibold bg-primary text-white rounded-md py-1 px-2 text-accent uppercase tracking-wider hover:underline" onClick={() => {

                            applyFilters()
                        }}>
                            Apply
                        </button>
                        <button className="text-xs font-semibold text-accent uppercase tracking-wider hover:underline" onClick={() => {
                            setFilters({
                                cuisine: 'All',
                                price: "",
                                rating: 0,
                                dist: 50,
                            })

                            applyFilters()
                        }}>
                            Clear All
                        </button>
                    </div>

                </div>

                <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-500 uppercase">Cuisine Type</p>
                    <div className="space-y-1">
                        <label className={`flex items-center gap-3 p-2 rounded-lg ${filters.cuisine === 'All' ? 'bg-primary/10 text-primary font-semibold' : 'font-medium'} cursor-pointer`} onClick={() => setFilters({ ...filters, cuisine: 'All' })}>


                            <span className="text-sm">All Cuisines</span>

                        </label>
                        {
                            cuisines.slice(0, 5).map((cuisine) => {
                                return (
                                    <label key={cuisine._id} className={`flex items-center gap-3 p-2 rounded-lg ${filters.cuisine === cuisine.name && 'bg-primary/10 text-primary font-semibold'} cursor-pointer`} onClick={() => setFilters({ ...filters, cuisine: cuisine.name })}>

                                        <span className="text-sm">{cuisine.name}</span>

                                    </label>
                                )
                            })
                        }

                    </div>
                </div>
                <hr className="border-primary/5" />

                <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-500 uppercase">Price Range</p>
                    <div className="flex gap-2">
                        <button className={`flex-1 py-1.5 rounded border border-primary/20 ${filters.price == '' && 'bg-primary text-white'}  text-sm font-medium"`} onClick={() => setFilters({ ...filters, price: '' })}>
                            All
                        </button>
                        <button className={`flex-1 py-1.5 rounded border border-primary/20 ${filters.price == '$' && 'bg-primary text-white'}  text-sm font-medium"`} onClick={() => setFilters({ ...filters, price: '$' })}>
                            $
                        </button>
                        <button className={`flex-1 py-1.5 rounded border border-primary/20 ${filters.price == '$$' && 'bg-primary text-white'}  text-sm font-medium"`} onClick={() => setFilters({ ...filters, price: '$$' })}>
                            $$
                        </button>
                        <button className={`flex-1 py-1.5 rounded border border-primary/20 ${filters.price == '$$$' && 'bg-primary text-white'}  text-sm font-medium"`} onClick={() => setFilters({ ...filters, price: '$$$' })}>
                            $$$
                        </button>

                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-500 uppercase">Minimum Rating</p>
                    <div className="flex items-center gap-2">
                        <input
                            className="w-full h-1.5 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary"
                            max="5"
                            min="1"
                            step="0.5"
                            type="range"

                            value={filters.rating}
                            onChange={(e) => setFilters({ ...filters, rating: Number.parseFloat(e.target.value) })}
                        />
                        <span className="text-sm font-bold text-primary">4.0+</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-500 uppercase">Distance (km)</p>
                    <select
                        className="w-full rounded-lg border-primary/10 bg-primary/5 text-sm py-2 px-3 focus:ring-primary/20 focus:border-primary"
                        value={filters.dist}
                        onChange={(e) => setFilters({ ...filters, dist: Number(e.target.value) })}
                    >
                        <option value={2}>Under 2 km</option>
                        <option value={5}>Under 5 km</option>
                        <option value={10}>Under 10 km</option>
                        <option value={50}>City Wide</option>
                    </select>

                </div>
            </div>
        </aside>
    )
}