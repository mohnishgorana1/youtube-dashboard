"use client";
import React, { useEffect, useState } from "react";
import { fetchYouTubeVideos } from "@/actions/youtubeVideos";
import Link from "next/link";

function Dashboard({
  fetchedVideos,
  userDetails,
}: {
  fetchedVideos: any;
  userDetails: any;
}) {
  const [videos, setVideos] = useState(fetchedVideos);
  const [loading, setLoading] = useState(false);

  return (
    <section className="mb-10">
      {loading && (
        <p className="animate-pulse text-xl md:text-3xl min-h-[80vh] md:min-h-[60vh]  flex items-center justify-center">
          Loading Videos...
        </p>
      )}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-12">
        {videos &&
          videos.map((v: any) => (
            <div
              key={v.id}
              className="flex flex-col bg-neutral-900 border border-neutral-800 rounded-md overflow-hidden hover:shadow-sm hover:shadow-neutral-800 transition-shadow"
            >
              <div className="aspect-video w-full">
                <iframe
                  src={`https://www.youtube.com/embed/${v.videoId}`}
                  title={v.title}
                  className="w-full h-full rounded-t-md text-sm"
                  allowFullScreen
                />
              </div>
              <div className="flex flex-col flex-1 p-4">
                <h2 className="font-semibold text-lg mb-2 line-clamp-1">
                  {v.title}
                </h2>
                <p className="text-sm text-neutral-400 opacity-50 mb-4 line-clamp-3">
                  {v.description}
                </p>

                {/* Button pinned at bottom */}
                <div className="mt-auto">
                  <Link
                    href={`/video/${v.videoId}`}
                    className="w-full block font-medium transition-colors text-red-500 hover:underline text-lg"
                  >
                    View & Edit →
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}

export default Dashboard;
