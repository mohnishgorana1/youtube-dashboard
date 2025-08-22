import { fetchComments, getVideoDetails } from "@/actions/youtubeVideos";
import VideoDetailsComponent from "@/app/components/VideoDetailsComponent";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function VideoDetailsPage({ params }: { params: { id: string } }) {
  const { id: videoId } = params;

  // user data from cookies
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  // redirect if not logged in
  if (!userId) {
    redirect("/"); // sends user to home page
  }

  const email = cookieStore.get("userEmail")?.value
    ? decodeURIComponent(cookieStore.get("userEmail")!.value)
    : null;
  const userName = decodeURIComponent(cookieStore.get("userName")?.value || "");
  const channelId = cookieStore.get("channelId")?.value;

  const userDetails = {
    email: email,
    channelId: channelId,
    userId: userId,
    userName: userName,
  };

  // fetch data
  const videoRes = await getVideoDetails(videoId);
  const commentRes = await fetchComments(videoId);
  const video = videoRes.success ? videoRes.data : null;
  const comments: any[] =
    commentRes.success && commentRes.data ? commentRes.data : [];

  return (
    <main className="px-1 md:px-2 lg:px-6 py-2 md:space-y-1 bg-neutral-950 min-h-screen text-neutral-20">
      <VideoDetailsComponent
        video={video}
        initialComments={comments}
        userDetails={userDetails}
      />
    </main>
  );
}

export default VideoDetailsPage;
