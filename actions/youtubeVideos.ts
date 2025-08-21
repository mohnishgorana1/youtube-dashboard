"use server";

import { getYoutubeClient } from "@/lib/youtube";

// ++++++++++++++++++++++++  videos  ++++++++++++++++++++++++++++++++
export async function fetchYouTubeVideos() {
  try {
    const youtube = await getYoutubeClient();

    // Get channel ID
    const channelRes = await youtube.channels.list({
      part: ["id", "contentDetails"],
      mine: true,
    });

    const channelId = channelRes.data.items?.[0]?.id;
    if (!channelId) throw new Error("Channel not found");

    const uploadPlaylistId =
      channelRes.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadPlaylistId) {
      return {
        success: false,
        message: "Error Fetching Upload Playlist of the user",
      };
    }

    // fetch videos
    const playlistRes = await youtube.playlistItems.list({
      part: ["snippet", "contentDetails"],
      playlistId: uploadPlaylistId,
    });

    const items =
      playlistRes.data.items?.map((v: any) => ({
        id: v.contentDetails?.videoId,
        title: v.snippet?.title || "",
        description: v.snippet?.description || "",
        thumbnail: v.snippet?.thumbnails?.medium?.url || "",
        videoId: v.contentDetails?.videoId || "",
      })) || [];

    return {
      success: true,
      message: "Videos Fetched Successfully",
      items: items,
    };
  } catch (err: any) {
    console.error("Error fetching YouTube videos:", err);
    // throw new Error("Failed to fetch videos");
    return {
      success: false,
      message: "Error Fetching Youtube Video",
      error: err.message,
    };
  }
}

export async function getVideoDetails(videoId: string) {
  if (!videoId) {
    return { success: false, message: "Invalid Video ID provided." };
  }
  try {
    const youtube = await getYoutubeClient();

    const res = await youtube.videos.list({
      part: ["snippet", "contentDetails", "statistics"],
      id: [videoId],
    });

    if (!res.data.items || res.data.items.length === 0) {
      return { success: false, message: "Video not found." };
    }

    const video = res.data.items[0];

    // Ensuring all required fields exist before returning
    if (
      !video.id ||
      !video.snippet?.title ||
      !video.snippet?.thumbnails?.high?.url
    ) {
      return { success: false, message: "Fetched video data is incomplete." };
    }

    return {
      success: true,
      message: "Video Details Fetched",
      data: {
        id: video.id,
        videoId: video.id,
        title: video.snippet.title,
        description: video.snippet.description || "",
        thumbnail: video.snippet.thumbnails.high.url,
        publishedAt: video.snippet.publishedAt || "",
        statastics: video.statistics,
      },
    };
  } catch (err: any) {
    console.error("Error fetching YouTube video:", err.message || err);
    // throw new Error("Failed to fetch video details");
    return {
      success: false,
      message: "Failed to fetch video details",
    };
  }
}

export async function editVideoMetaData(
  videoId: string,
  title: string,
  description: string
) {
  if (!videoId || !title || !description) {
    return {
      success: false,
      message: "Invalid Request Data",
    };
  }
  try {
    console.log("req for edit vid meta data", videoId, title, description);

    const youtube = await getYoutubeClient();

    const existing = await youtube.videos.list({
      id: [videoId],
      part: ["snippet"],
    });

    const snippet = existing.data.items?.[0]?.snippet;
    if (!snippet) throw new Error("Video not found");

    const res = await youtube.videos.update({
      part: ["snippet"],
      requestBody: {
        id: videoId,
        snippet: {
          ...snippet,
          title,
          description,
        },
      },
    });

    return {
      success: true,
      data: res.data,
      message: "Video Meta Data Edited",
    };
  } catch (err: any) {
    console.error("Error editing YouTube video metadata:", err.message || err);
    // throw new Error("Failed to edit video details");
    return {
      success: false,
      message: "Failed to edit video details",
    };
  }
}

//+++++++++++++++++++++ comments+++++++++++++++++++++++++++++
export async function fetchComments(videoId: string) {
  if (!videoId) {
    return {
      success: false,
      message: "No Video ID Provided",
    };
  }
  try {
    console.log("req for all comments on video", videoId);

    const youtube = await getYoutubeClient();

    const res = await youtube.commentThreads.list({
      videoId: videoId,
      part: ["snippet"],
    });

    console.log("comments response", res.data.items?.length && res.data.items);

    return {
      success: true,
      data: res.data.items,
      message: "Comment Fetched Successfully",
    };
  } catch (err: any) {
    console.error("Error Fetching Comments", err.message || err);
    // throw new Error("Failed to edit video details");
    return {
      success: false,
      message: "Error Fetching Comments",
    };
  }
}
export async function addComment(videoId: string, commentText: string) {
  if (!videoId || !commentText) {
    return {
      success: false,
      message: "Invalid Request Data",
    };
  }
  try {
    console.log("req for comment on video", videoId, commentText);

    const youtube = await getYoutubeClient();

    // top level comment
    const res = await youtube.commentThreads.insert({
      part: ["snippet"],
      requestBody: {
        snippet: {
          videoId,
          topLevelComment: {
            snippet: {
              textOriginal: commentText,
            },
          },
        },
      },
    });
    return {
      success: true,
      data: res.data,
      message: "Comment Added successfully",
    };
  } catch (err: any) {
    console.error("Error commenting on requested video", err.message || err);
    return {
      success: false,
      message: "Failed to add comment on requested video",
    };
  }
}

//+++++++++++++++++++++++ replies ++++++++++++++++++++++++++++++++++++
export async function fetchReplies(commentThreadId: string) {
  if (!commentThreadId) {
    return {
      success: false,
      message: "No Comment Thread ID Provided",
    };
  }
  try {
    const youtube = await getYoutubeClient();

    const response = await youtube.comments.list({
      part: ["id", "snippet"],
      parentId: commentThreadId,
    });

    const replies = response.data.items || [];

    return {
      success: true,
      data: replies || [],
      message: "Replies fetched successfully",
    };
  } catch (err: any) {
    console.error(
      "Error fetching replies for requested comment thread id",
      err.message || err
    );
    return {
      success: false,
      message: "Failed to fetching replies for requested comment thread id",
    };
  }
}
export async function addReply(
  videoId: string,
  parentId: string,
  text: string
) {
  if (!videoId || !parentId || !text) {
    return {
      success: false,
      message: "Invalid Request Data",
    };
  }
  try {
    console.log(
      "req for reply on comment of a video with videoId:",
      videoId,
      "\nparentId : ",
      parentId,
      "\nreplyText: ",
      text
    );

    const youtube = await getYoutubeClient();

    // reply
    const res = await youtube.comments.insert({
      part: ["snippet"],
      requestBody: {
        snippet: {
          parentId,
          textOriginal: text,
          videoId,
        },
      },
    });
    return {
      success: true,
      data: res.data,
      message: "Comment Added successfully",
    };
  } catch (err: any) {
    console.error("Error commenting on requested video", err.message || err);
    return {
      success: false,
      message: "Failed to add comment on requested video",
    };
  }
}

// ++++++++++++++++ DELETE COMMENT/REPLY +++++++++++++++++++++++++++
export async function deleteComment(commentId: string) {
  if (!commentId) {
    return { success: false, message: "No Reply ID Provided" };
  }
  console.log("req to dlt comment / reply with ID: ", commentId);

  try {
    const youtube = await getYoutubeClient();

    const res = await youtube.comments.delete({
      id: commentId,
    });
    console.log("Res of delete comment", res.data);
    return {
      success: true,
      message: "Reply deleted successfully",
      data: res.data,
    };
  } catch (err: any) {
    console.error("Error deleting reply", err.message || err);
    return {
      success: false,
      message: "Failed to delete reply",
    };
  }
}
