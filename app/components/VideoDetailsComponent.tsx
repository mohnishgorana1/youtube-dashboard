"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import CommentsSection from "./CommentsSection";
import EditVideoForm from "./EditVideoForm";
import NotesSection from "./NotesSection";
import {
  addComment,
  deleteComment,
  editVideoMetaData,
} from "@/actions/youtubeVideos";
import { AiFillLike } from "react-icons/ai";
import toast from "react-hot-toast";

type VideoDetailsProps = {
  video: any;
  initialComments: any[];
  userDetails: any;
};

function VideoDetailsComponent({
  video,
  initialComments,
  userDetails,
}: VideoDetailsProps) {
  const router = useRouter();
  const [currentVideo, setCurrentVideo] = useState(video);
  const [comments, setComments] = useState(initialComments);

  console.log("initial comments", initialComments);

  const handleAddComment = async (commentText: string) => {
    const res = await addComment(currentVideo.videoId, commentText);
    if (res.success && res.data) {
      // naya comment UI me inject krna padega
      setComments((prev) => [res.data, ...prev]);
      toast.success("Comment Added");
    } else {
      console.log("Error adding comment: ", res.message);
      toast.error("Failed to Add Comment");
    }
  };
  const handleDeleteComment = async (commentId: string) => {
    console.log("req to delete comment for commentId: ", commentId);
    try {
      const res = await deleteComment(commentId);
      if (res.success) {
        // remove deleted comment
        setComments((prev) =>
          prev.filter(
            (c) => c.snippet?.topLevelComment?.id !== commentId // <-- FIXED
          )
        );
        toast.success("Comment Deleted!");
      } else {
        toast.error("Failed to Delete Comment");
      }
    } catch (error) {
      console.log("Error deleting comment", error);
      toast.error("Failed to Delete Comment");
    }
  };
  // --- Edit Video
  const handleEditVideo = async (title: string, description: string) => {
    const res = await editVideoMetaData(
      currentVideo.videoId,
      title,
      description
    );
    if (res.success && res.data && res.data?.snippet) {
      setCurrentVideo({
        ...currentVideo,
        title: res.data.snippet.title,
        description: res.data.snippet.description,
      });
      router.refresh();
      toast.success("Video Metadata Updated Successfully!");
    } else {
      console.log("Error Edit VideoDetails", res.message);
      toast.error("Failed to Update Video Metadata!");
    }
  };

  if (!video)
    return (
      <p className="text-red-500 text-3xl lg:text-7xl min-h-[80vh] flex items-center justify-center ">
        No video Found
      </p>
    );

  return (
    <div className="space-y-3 mb-10">
      {/* Video + Info */}
      <section className="md:grid md:grid-cols-5 gap-x-3 gap-y-6">
        <div className="rounded-xl md:col-span-3 bg-neutral-900 shadow p-4 flex flex-col gap-y-2">
          <div className="aspect-video w-full">
            <iframe
              id="video-frame"
              src={`https://www.youtube.com/embed/${currentVideo.videoId}`}
              title={currentVideo.title}
              allowFullScreen
              className="w-full h-full "
            />
          </div>

          <span className="flex items-center gap-x-1 text-lg">
            <AiFillLike className="text-red-500" />

            <>{currentVideo.statastics.likeCount}</>
          </span>

          <article className="mt-2 flex flex-col gap-y-1">
            <span className="font-semibold">Description</span>
            <p className="text-neutral-400 text-sm whitespace-pre-line line-clamp-8 overflow-y-scroll text-scrollbar">
              {video.description ||
                "No Description No DescriptionNo DescriptionNo DescriptionNo DescriptionNo DescriptionNo DescriptionNo DescriptionNo DescriptionNo DescriptionNo DescriptionNo DescriptionNo DescriptionNo DescriptionNo DescriptionNo DescriptionNo DescriptionNo DescriptionNo DescriptionNo DescriptionNo DescriptionNo DescriptionNo DescriptionNo DescriptionNo DescriptionNo DescriptionNo DescriptionNo DescriptionNo DescriptionNo DescriptionNo DescriptionNo DescriptionNo DescriptionNo DescriptionNo Description"}
            </p>
          </article>

          <CommentsSection
            currentVideo={currentVideo}
            comments={comments}
            onAdd={handleAddComment}
            onDelete={handleDeleteComment}
          />
        </div>
        <div className="rounded-xl md:col-span-2 bg-neutral-900 shadow p-4 mt-5 md:mt-0">
          <h2 className=" text-white font-semibold text-xl md:text-2xl lg:text-center mb-5">
            Edit Video
          </h2>
          <EditVideoForm
            video={currentVideo}
            onSave={(t, d) => handleEditVideo(t, d)}
          />
        </div>
      </section>
      {/* Notes */}
      <section className="bg-neutral-900 px-3 py-3 rounded-xl">
        <NotesSection videoId={video.videoId} userDetails={userDetails} />
      </section>
    </div>
  );
}

export default VideoDetailsComponent;
