"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { IVideo } from "@/models/Video";
import Image from "next/image";

interface VideoWithId extends Omit<IVideo, "_id"> {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

// Dummy video data
const dummyVideos: VideoWithId[] = [
  {
    _id: "1",
    title: "Amazing Dance Moves Tutorial - Learn Hip Hop Steps",
    description: "Master the hottest hip hop dance moves with this comprehensive tutorial. Perfect for beginners and intermediate dancers!",
    videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    thumbnailUrl: "https://picsum.photos/seed/dance/400/300",
    controls: true,
    createdAt: "2024-08-15T10:30:00Z",
    updatedAt: "2024-08-15T10:30:00Z",
  },
  {
    _id: "2",
    title: "Quick 15-Minute Pasta Recipe - Perfect for Busy Days",
    description: "Learn how to make delicious pasta in just 15 minutes. This quick and easy recipe is perfect for weeknight dinners!",
    videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    thumbnailUrl: "https://picsum.photos/seed/cooking/400/300",
    controls: true,
    createdAt: "2024-08-10T14:20:00Z",
    updatedAt: "2024-08-10T14:20:00Z",
  },
  {
    _id: "3",
    title: "Home Workout Routine - No Equipment Needed",
    description: "Get fit at home with this effective no-equipment workout routine. Build strength and endurance from your living room!",
    videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    thumbnailUrl: "https://picsum.photos/seed/fitness/400/300",
    controls: true,
    createdAt: "2024-08-05T09:15:00Z",
    updatedAt: "2024-08-05T09:15:00Z",
  },
  {
    _id: "4",
    title: "Mountain Lake Adventure - Stunning Travel Vlog",
    description: "Join me on an incredible journey to the most beautiful mountain lake. Breathtaking views and unforgettable experiences!",
    videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    thumbnailUrl: "https://picsum.photos/seed/travel/400/300",
    controls: true,
    createdAt: "2024-07-28T16:45:00Z",
    updatedAt: "2024-07-28T16:45:00Z",
  },
  {
    _id: "5",
    title: "Abstract Art Techniques - Creative Studio Session",
    description: "Explore various abstract art techniques in this studio session. Learn how to express yourself through colors and textures!",
    videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    thumbnailUrl: "https://picsum.photos/seed/art/400/300",
    controls: true,
    createdAt: "2024-07-20T11:00:00Z",
    updatedAt: "2024-07-20T11:00:00Z",
  },
  {
    _id: "6",
    title: "Cute Dog Tricks - Training Your Puppy",
    description: "Watch these adorable dogs perform amazing tricks! Learn how to train your puppy with positive reinforcement techniques.",
    videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    thumbnailUrl: "https://picsum.photos/seed/pets/400/300",
    controls: true,
    createdAt: "2024-07-15T13:30:00Z",
    updatedAt: "2024-07-15T13:30:00Z",
  },
];

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [videos, setVideos] = useState<VideoWithId[]>(dummyVideos);
  const [loading, setLoading] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Uncomment this to fetch real videos from API
  // useEffect(() => {
  //   if (status === "authenticated") {
  //     fetchVideos();
  //   }
  // }, [status]);

  // const fetchVideos = async () => {
  //   try {
  //     const response = await fetch("/api/video");
  //     if (response.ok) {
  //       const data = await response.json();
  //       if (Array.isArray(data)) {
  //         setVideos(data);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error fetching videos:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const formatViews = (num: number) => {
    return num.toLocaleString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getVideoDuration = () => {
    const durations = ["3:45", "15:22", "8:15", "12:30", "18:45", "5:20"];
    return durations[Math.floor(Math.random() * durations.length)];
  };

  const getVideoCategory = () => {
    const categories = ["Dance", "Cooking", "Fitness", "Travel", "Art", "Pets"];
    return categories[Math.floor(Math.random() * categories.length)];
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="font-head text-2xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="font-head text-5xl font-bold mb-4">Latest Videos</h1>
          <p className="text-muted-foreground text-lg font-head">
            Discover amazing content from our creators
          </p>
        </div>

        {/* Videos Grid */}
        {videos.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-head text-2xl text-muted-foreground mb-6">
              No videos available yet
            </p>
            <a
              href="/upload"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_black] hover:shadow-[6px_6px_0px_0px_black] transition-all duration-150 font-head text-lg"
            >
              Upload First Video
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, index) => (
              <div
                key={video._id}
                className="font-head border-4 border-black rounded-lg shadow-[6px_6px_0px_0px_black] hover:shadow-[12px_12px_0px_0px_black] transition-shadow duration-150 ease-in-out bg-card overflow-hidden"
              >
                {/* Video Thumbnail with Play Button */}
                <div className="relative group cursor-pointer">
                  {playingVideo === video._id ? (
                    <video
                      src={video.videoUrl}
                      controls={true}
                      className="w-full h-64 object-cover"
                      autoPlay
                    />
                  ) : (
                    <>
                      <Image
                        src={video.thumbnailUrl}
                        alt={video.title}
                        width={400}
                        height={256}
                        className="w-full h-64 object-cover"
                      />
                      {/* Category Badge */}
                      <span className="absolute top-3 left-3 px-3 py-1 bg-primary text-black border-2 border-black rounded text-sm font-bold shadow-[2px_2px_0px_0px_black]">
                        {getVideoCategory()}
                      </span>
                      {/* Duration Badge */}
                      <span className="absolute top-3 right-3 px-2 py-1 bg-black text-white rounded text-sm font-mono">
                        {getVideoDuration()}
                      </span>
                      {/* Play Button Overlay */}
                      <div
                        onClick={() => setPlayingVideo(video._id)}
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200"
                      >
                        <div className="px-6 py-3 bg-primary text-black border-3 border-black rounded-lg shadow-[4px_4px_0px_0px_black] group-hover:shadow-[6px_6px_0px_0px_black] transition-all duration-150 flex items-center gap-2 opacity-0 group-hover:opacity-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          <span className="font-bold">Play</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Video Info */}
                <div className="p-6">
                  {/* Creator Info */}
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary border-2 border-black flex items-center justify-center font-bold text-black shadow-[2px_2px_0px_0px_black]">
                      {video.title.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-bold text-lg leading-tight">
                        {video.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {video.description}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{formatViews(15420 + index * 1000)} views</span>
                    <span>{formatDate(video.createdAt)}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t-2 border-border">
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      <span className="font-bold">
                        {892 + index * 50}
                      </span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      <span className="font-bold">{127 + index * 20}</span>
                    </button>
                    <button className="hover:text-primary transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t-4 border-black mt-20 py-8 bg-secondary text-secondary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-head text-lg">
            Made with ❤️ by PopReel Team
          </p>
          <p className="font-head text-sm mt-2 opacity-75">
            © 2025 PopReel. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

