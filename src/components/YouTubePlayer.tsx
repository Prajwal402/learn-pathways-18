import { useEffect, useRef, useCallback } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayerProps {
  videoId: string;
  startSeconds?: number;
  onProgress?: (seconds: number) => void;
  onEnd?: () => void;
}

function extractVideoId(url: string): string {
  // Handle various YouTube URL formats or plain video IDs
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|.*&v=))([^?&"'>]+)/);
  return match ? match[1] : url;
}

export function YouTubePlayer({ videoId, startSeconds = 0, onProgress, onEnd }: YouTubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<number>();
  const actualVideoId = extractVideoId(videoId);

  const startTracking = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      if (playerRef.current?.getCurrentTime) {
        onProgress?.(Math.floor(playerRef.current.getCurrentTime()));
      }
    }, 10000); // every 10 seconds
  }, [onProgress]);

  useEffect(() => {
    const loadAPI = () => {
      if (window.YT?.Player) {
        createPlayer();
        return;
      }
      if (!document.getElementById("yt-iframe-api")) {
        const tag = document.createElement("script");
        tag.id = "yt-iframe-api";
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
      window.onYouTubeIframeAPIReady = createPlayer;
    };

    const createPlayer = () => {
      if (!containerRef.current) return;
      if (playerRef.current?.destroy) playerRef.current.destroy();

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: actualVideoId,
        playerVars: {
          start: startSeconds,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onStateChange: (e: any) => {
            if (e.data === window.YT.PlayerState.PLAYING) {
              startTracking();
            } else if (e.data === window.YT.PlayerState.ENDED) {
              if (intervalRef.current) clearInterval(intervalRef.current);
              onEnd?.();
            } else if (e.data === window.YT.PlayerState.PAUSED) {
              if (intervalRef.current) clearInterval(intervalRef.current);
              if (playerRef.current?.getCurrentTime) {
                onProgress?.(Math.floor(playerRef.current.getCurrentTime()));
              }
            }
          },
        },
      });
    };

    loadAPI();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (playerRef.current?.destroy) playerRef.current.destroy();
    };
  }, [actualVideoId, startSeconds, onEnd, startTracking, onProgress]);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg bg-foreground/5">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
