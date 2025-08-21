"use client";

import { addReply, deleteComment, fetchReplies } from "@/actions/youtubeVideos";
import { timeAgo } from "@/helper";
import { Reply, VideoDetails } from "@/interfaces";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillLike } from "react-icons/ai";
import { MdDelete, MdDeleteOutline } from "react-icons/md";

export default function CommentsSection({
  currentVideo,
  comments,
  onAdd,
  onDelete,
}: {
  currentVideo: VideoDetails;
  comments: any[];
  onAdd: (text: string) => void;
  onDelete: (id: string) => void;
}) {
  const [text, setText] = useState("");
  const [loadingReplies, setLoadingReplies] = useState<string | null>(null);

  // replies ka store -> { commentId: Reply[] }
  const [replies, setReplies] = useState<Record<string, Reply[]>>({});

  const handleFetchReplies = async (commentThreadId: string) => {
    // agar already replies hai to clear kardo (collapse)
    if (replies[commentThreadId]) {
      // collapse
      setReplies((prev) => {
        const updated = { ...prev }; // prev = purana replies object--> fir updated me shallow copy kiya us prev replies obj ko
        delete updated[commentThreadId];
        return updated;
      });
      return; // bas collapse ho gya ab niche ke code pe mat jao ab fetch nhi krna hai
    }

    // fetch replies from API
    setLoadingReplies(commentThreadId);
    const res = await fetchReplies(commentThreadId);
    if (res.success) {
      const repliesList = res.data;
      setReplies((prev) => ({
        ...prev,
        [commentThreadId]: repliesList as Reply[],
      }));
    } else {
      toast.error("Error Fetching Replies");
    }
    setLoadingReplies(null);
  };

  const handleAddReply = async (
    parentId: string,
    replyText: string,
    clearInput: () => void
  ) => {
    if (!replyText.trim()) return;

    try {
      const res = await addReply(currentVideo.videoId, parentId, replyText);
      if (res.success && res.data) {
        setReplies((prev) => ({
          ...prev,
          [parentId]: [...(prev[parentId] || []), res.data as Reply],
        }));
        clearInput();
      } else {
        toast.error("Failed to add reply.");
      }
    } catch (error) {
      console.log("Error adding reply", error);
    }
  };
  const handleDeleteReply = async (replyId: string, parentId: string) => {
    console.log("request to dlet reply with replyid", replyId);

    try {
      const res = await deleteComment(replyId);
      if (res.success) {
        // remove deleted reply from state
        setReplies((prev) => {
          return {
            ...prev,
            [parentId]: prev[parentId]?.filter((r) => r.id !== replyId) || [],
          };
        });
        toast.success("Reply Deleted!");
      } else {
        toast.error("Failed To Delete Reply");
      }
    } catch (error) {
      console.log("Error deleting reply", error);
    }
  };

  return (
    <div className="mt-4 space-y-2 ">
      <h4 className="font-semibold flex gap-x-1 items-center">
        Comments{" "}
        <span className="opacity-70 font-medium text-sm">
          {currentVideo.statastics.commentCount}
        </span>
      </h4>
      <span className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="rounded-2xl h-8 px-2 border border-neutral-800 w-full focus:outline-none text-sm"
        />
        <button
          onClick={() => {
            if (!text.trim()) return;
            onAdd(text);
            setText("");
          }}
          className="rounded-2xl h-8 px-4 bg-neutral-800 hover:bg-neutral-950 duration-300 ease-in text-white font-medium text-sm"
        >
          Comment
        </button>
      </span>

      {/* Top level comments */}
      <ul className="mt-2 space-y-2">
        {comments.map((c: any) => {
          const { id: commentId } = c;
          const {
            authorDisplayName,
            authorChannelUrl,
            authorProfileImageUrl,
            likeCount,
            publishedAt,
            textDisplay,
          } = c.snippet.topLevelComment.snippet;
          const { totalReplyCount } = c.snippet;
          const commentReplies = replies[commentId] || [];

          return (
            <li
              key={commentId}
              className="flex gap-x-2 pb-3 border-b border-neutral-800"
            >
              <div className="rounded-full">
                <Image
                  src={authorProfileImageUrl}
                  width={32}
                  height={32}
                  alt="profile_url"
                  className="rounded-full"
                />
              </div>
              <div className="space-y-1 flex-1">
                <span className="flex gap-x-3 opacity-70 text-xs">
                  <Link href={authorChannelUrl}>{authorDisplayName}</Link>
                  <p>{timeAgo(publishedAt)}</p>
                </span>
                <span className="flex items-center gap-x-3 w-full justify-between">
                  <p>{textDisplay}</p>

                  <button
                    onClick={() => onDelete(c.snippet.topLevelComment.id)}
                    className="text-lg flex items-center group ease-out duration-500"
                  >
                    {/* Delete */}
                    <MdDelete className="group-hover:hidden ease-out duration-500" />
                    <MdDeleteOutline className="hidden group-hover:block ease-out duration-500" />
                  </button>
                </span>
                <span className="flex gap-x-3 items-center">
                  <p className="flex gap-x-1 items-center opacity-70">
                    <AiFillLike /> {likeCount}
                  </p>
                </span>

                {/* reply btn for top-level comments */}
                <TopLevelReplyBox
                  parentId={commentId}
                  onReply={handleAddReply}
                />

                {/* Replies Toggle */}
                {totalReplyCount > 0 && (
                  <button
                    onClick={() => handleFetchReplies(commentId)}
                    className="text-blue-400 text-xs mt-1 hover:underline"
                  >
                    {loadingReplies === commentId
                      ? "Loading replies..."
                      : replies[commentId]
                      ? "Hide replies"
                      : `View ${totalReplyCount} replies`}
                  </button>
                )}

                {/* Replies List */}
                {commentReplies.length > 0 && (
                  <ul className="mt-2 ml-8 space-y-2 border-l border-neutral-800 pl-3">
                    {commentReplies.map((r) => (
                      <ReplyComponent
                        key={r.id}
                        reply={r}
                        parentId={commentId}
                        onReply={handleAddReply}
                        onDelete={handleDeleteReply}
                      />
                    ))}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Reply box for top-level comments
function TopLevelReplyBox({
  parentId,
  onReply,
}: {
  parentId: string;
  onReply: (parentId: string, text: string, clearInput: () => void) => void;
}) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleSubmit = () => {
    if (!replyText.trim()) return;
    onReply(parentId, replyText, () => setReplyText(""));
    setShowReplyBox(false);
  };

  return (
    <div className="mt-1">
      <button
        onClick={() => setShowReplyBox(!showReplyBox)}
        className="text-blue-400 text-xs hover:underline"
      >
        Reply
      </button>
      {showReplyBox && (
        <div className="mt-2 flex gap-2">
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="rounded-2xl border border-neutral-800 px-2 py-1 text-xs flex-1 focus:outline-none"
          />
          <button
            onClick={handleSubmit}
            className="rounded-2xl bg-neutral-800 text-white px-4 py-1 text-sm"
          >
            Reply
          </button>
        </div>
      )}
    </div>
  );
}

// Reply Component (for replies only, not nested)
function ReplyComponent({
  reply,
  parentId,
  onReply,
  onDelete,
}: {
  reply: Reply;
  parentId: string;
  onReply: (parentId: string, text: string, clearInput: () => void) => void;
  onDelete: (replyId: string, parentId: string) => void;
}) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleSubmit = () => {
    if (!replyText.trim()) return;
    onReply(parentId, replyText, () => setReplyText("")); // <-- parent se handle
    setShowReplyBox(false);
  };

  return (
    <li className="flex gap-2">
      <div className="rounded-full mt-1">
        <Image
          src={reply.snippet.authorProfileImageUrl}
          width={24}
          height={24}
          alt="reply_avatar"
          className="rounded-full"
        />
      </div>
      <div className="flex-1">
        <span className="text-xs opacity-70 flex gap-x-2">
          <Link href={reply.snippet.authorChannelUrl}>
            {reply.snippet.authorDisplayName}
          </Link>
          <p>{timeAgo(reply.snippet.publishedAt)}</p>
        </span>
        <span className="flex justify-between items-center max-w-xl">
          <p
            className="text-sm"
            dangerouslySetInnerHTML={{
              __html: reply.snippet.textDisplay,
            }}
          />
          <button
            onClick={() => onDelete(reply.id, parentId)}
            className="text-lg flex items-center group ease-out duration-500"
          >
            {/* Delete */}
            <MdDelete className="group-hover:hidden ease-out duration-500" />
            <MdDeleteOutline className="hidden group-hover:block ease-out duration-500" />
          </button>
        </span>

        {/* Reply Button */}
        <button
          onClick={() => setShowReplyBox(!showReplyBox)}
          className="text-blue-400 text-xs hover:underline"
        >
          Reply
        </button>

        {showReplyBox && (
          <div className="mt-2 flex gap-2">
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="rounded-2xl border border-neutral-800 px-2 py-1 text-xs flex-1 focus:outline-none"
            />
            <button
              onClick={handleSubmit}
              className="rounded-2xl bg-neutral-800 text-white px-4 py-1 text-sm"
            >
              Reply
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
