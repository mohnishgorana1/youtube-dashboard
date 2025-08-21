import { fetchComments, getVideoDetails } from "@/actions/youtubeVideos";
import VideoDetailsComponent from "@/app/components/VideoDetailsComponent";
import { cookies } from "next/headers";

async function VideoDetailsPage({ params }: { params: { id: string } }) {
  const { id: videoId } = params;

  // fetch data
  const videoRes = await getVideoDetails(videoId);
  const commentRes = await fetchComments(videoId);
  const video = videoRes.success ? videoRes.data : null;
  const comments: any[] =
    commentRes.success && commentRes.data ? commentRes.data : [];

  // user data from cookies
  const cookieStore = await cookies();
  const email = cookieStore.get("userEmail")?.value
    ? decodeURIComponent(cookieStore.get("userEmail")!.value)
    : null;
  const userName = decodeURIComponent(cookieStore.get("userName")?.value || "");
  const userId = cookieStore.get("userId")?.value;
  const channelId = cookieStore.get("channelId")?.value;
  let userDetails: any;
  if (email || userName || userId || channelId) {
    userDetails = {
      email: email,
      channelId: channelId,
      userId: userId,
      userName: userName,
    };
  }

  return (
    <main className="px-1 md:px-2 lg:px-6 py-2 md:space-y-1 bg-neutral-950 min-h-screen text-neutral-20">
      <VideoDetailsComponent video={video} initialComments={comments} userDetails={userDetails}/>
    </main>
  );
}

export default VideoDetailsPage;
