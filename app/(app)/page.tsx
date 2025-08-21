import { cookies } from "next/headers";
import Dashboard from "../components/Dashboard";
import { connectYoutube } from "@/actions/auth";
import { FaYoutube } from "react-icons/fa";
import { fetchYouTubeVideos } from "@/actions/youtubeVideos";
import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";
export default async function Home() {
  const cookieStore = await cookies();
  const email = cookieStore.get("userEmail")?.value
    ? decodeURIComponent(cookieStore.get("userEmail")!.value)
    : null;
  const userName = decodeURIComponent(cookieStore.get("userName")?.value || "");
  const userId = cookieStore.get("userId")?.value;
  const channelId = cookieStore.get("channelId")?.value;

  let videos: any;
  let userDetails: any;
  if (email || userName || userId || channelId) {
    const videoRes = await fetchYouTubeVideos();
    videos = videoRes.success && videoRes.items;
    userDetails = {
      email: email,
      channelId: channelId,
      userId: userId,
      userName: userName,
    };
  }

  return (
    <main className="relative w-full text-white">
      {!userDetails ? (
        <HeroSection />
      ) : (
        <div className="flex flex-col ">
          <section className="w-full mt-2 md:mt-6 space-y-8 px-4 lg:px-8">
            <header className="flex items-center justify-between mb-2">
              <h2 className="text-sm lg:text-xl font-bold">
                Hello, {userName || "User"} 👋
              </h2>
              <p className="text-gray-400 text-xs lg:text-sm hidden sm:inline">
                {email}
              </p>
            </header>
            {/* i want some text here to describe about dashboard */}
            <p className="text-gray-300 text-xs sm:text-sm md:text-base mb-8">
              Manage your videos, comments, and notes — all in one place.
            </p>
            <Dashboard fetchedVideos={videos} userDetails={userDetails} />
          </section>
        </div>
      )}
    </main>
  );
}
