import { useRef } from "react";
import { useNavigate } from "react-router";
import type { Reel } from "../../../../apis/reels";

export function ReelCard({ reel }: { reel: Reel }) {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  function handleMouseEnter() {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }

  function handleMouseLeave() {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; 
    }
  }

  return (
    <div
      className="aspect-[9/16] relative rounded-2xl overflow-hidden group cursor-pointer"
      onClick={() => navigate(`/reels/${reel._id}`)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
        src={reel.videoUrl}
        muted
        loop
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
      <div className="absolute bottom-3 left-3 right-3">
        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">favorite</span>{" "}
            {reel.likeCount}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">visibility</span>
            {reel.views}
          </span>
        </div>
      </div>
    </div>
  );
}
