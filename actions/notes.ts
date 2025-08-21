"use server";

import connectDB from "@/config/db";
import NoteModel from "@/models/note.model";
import { cookies } from "next/headers";

export const addNoteToVideo = async (
  userId: string,
  videoId: string,
  content: string,
  tags: string[]
) => {
  if (!userId) {
    return { success: false, message: "User not logged in" };
  }
  if (!videoId || !content) {
    return { success: false, message: "Missing videoId or content" };
  }

  try {
    await connectDB();

    const note = await NoteModel.create({
      userId,
      videoId,
      content,
      tags,
    });

    return {
      success: true,
      message: "Note added",
      data: JSON.parse(JSON.stringify(note)),
    };
  } catch (err) {
    console.error("Error adding note:", err);
    return { success: false, message: "Failed to add note" };
  }
};

export const fetchNotesForVideo = async (videoId: string) => {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) return { success: false, message: "User not logged in" };

  try {
    await connectDB();
    const notes = await NoteModel.find({ userId, videoId }).sort({
      createdAt: -1,
    });
    return {
      success: true,
      message: "Notes Fetched",
      data: JSON.parse(JSON.stringify(notes)),
    };
  } catch (err) {
    console.error("Error fetching notes:", err);
    return { success: false, message: "Failed to fetch notes", data: [] };
  }
};

export async function deleteNoteFromVideo(noteId: string) {
  await connectDB();

  if (!noteId) return { success: false, message: "Note ID not provided" };

  try {
    const deletedNote = await NoteModel.findByIdAndDelete(noteId);

    if (!deletedNote) {
      return { success: false, message: "Note not found or already deleted" };
    }

    return {
      success: true,
      message: "Note deleted successfully",
      data: JSON.parse(JSON.stringify(deletedNote)),
    };
  } catch (error) {
    console.error("Error deleting note:", error);
    return { success: false, error: "Failed to delete note" };
  }
}

export async function searchNotes(
  videoId: string,
  query: string,
  tags: string[] = []
) {
  await connectDB();

  if (!videoId) {
    return { success: false, message: "Video ID not provided" };
  }

  try {
    // Build search conditions
    const conditions: any = { videoId };

    if (query) {
      conditions.content = { $regex: query, $options: "i" }; // case-insensitive text search
    }

    if (tags.length > 0) {
      conditions.tags = { $in: tags }; // at least one tag must match
    }

    const notes = await NoteModel.find(conditions).sort({ createdAt: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(notes)) };
  } catch (error) {
    console.error("Error searching notes:", error);
    return { success: false, message: "Failed to search notes" };
  }
}
