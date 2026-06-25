export function AchievementBadge() {
    return (
        <div className="flex items-center gap-3 bg-primary/5 px-4 py-2 rounded-lg border border-primary/20">
            <span className="material-symbols-outlined text-primary">local_fire_department</span>
            <span className="text-sm font-bold">10 Day Streak</span>
        </div>
    )
}

export function AchievementBadgeAlt() {
    return (
        <div className="flex items-center gap-3 bg-accent/5 px-4 py-2 rounded-lg border border-accent/20">
            <span className="material-symbols-outlined text-accent">camera</span>
            <span className="text-sm font-bold">Top Photographer</span>
        </div>
    )
}