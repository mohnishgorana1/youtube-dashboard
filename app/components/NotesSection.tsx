"use client";
import {
  addNoteToVideo,
  deleteNoteFromVideo,
  fetchNotesForVideo,
} from "@/actions/notes";
import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { ImCross } from "react-icons/im";
import { RiDeleteBin5Line } from "react-icons/ri";

function NotesSection({
  videoId,
  userDetails,
}: {
  videoId: string;
  userDetails: any;
}) {
  const [notes, setNotes] = useState<any[]>([]);

  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const [loadingNoteId, setLoadingNoteId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterTags, setFilterTags] = useState<string[]>([]);

  const loadNotes = async () => {
    const res = await fetchNotesForVideo(videoId);
    if (res.success) {
      setNotes(res.data);
      // toast.success("Notes Fetched Successsfully")
    } else {
      toast.error("Failed to fetch notes");
    }
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput("");
  };
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const addNote = async () => {
    if (!content.trim()) return;

    const res = await addNoteToVideo(
      userDetails.userId,
      videoId,
      content,
      tags
    );

    if (res.success && res.data) {
      setNotes((prev) => [res.data, ...prev]);
      setContent("");
      setTags([]);
      toast.success("Note added successfully!");
    } else {
      toast.error("Failed to add note.");
    }
  };

  const deleteNote = async (noteId: string) => {
    setLoadingNoteId(noteId);
    try {
      const res = await deleteNoteFromVideo(noteId);
      if (res.success && res.data) {
        setNotes((prevNotes) =>
          prevNotes.filter((note) => note._id !== noteId)
        );
        toast.success("Note deleted successfully!");
      } else {
        toast.error("Error deleting note.");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Error deleting note.");
    } finally {
      setLoadingNoteId(null);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [videoId]);

  // collect all tags across notes for filtering UI
  const allTags = useMemo(
    () => Array.from(new Set(notes.flatMap((n) => n.tags || []))),
    [notes]
  );

  // client-side filtering
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch = note.content
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesTags =
        filterTags.length === 0 ||
        filterTags.every((tag) => note.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [notes, searchQuery, filterTags]);

  const toggleFilterTag = (tag: string) => {
    setFilterTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="space-y-2">
      <h4 className="text-white font-semibold mb-5 ml-1">Notes</h4>

      {/* Note content */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your note here..."
        className="rounded-2xl w-full border border-neutral-700 focus:outline-none pl-3 py-1 text-sm resize-none"
        rows={3}
      />

      {/* Tags */}
      <div className="flex gap-2">
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="Add tag"
          className="rounded-2xl flex-1 border border-neutral-700 focus:outline-none pl-3 py-1 text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
        />
        <button
          onClick={addTag}
          className="rounded-2xl px-3 py-1 bg-neutral-200 text-black hover:bg-neutral-300 text-sm font-medium"
        >
          Add Tag
        </button>
      </div>
      <div className="flex gap-2 flex-wrap items-center mt-3 mb-4">
        {tags.map((t) => (
          <span
            key={t}
            className="bg-transparent border border-neutral-200 text-white px-2 py-0.5 rounded-full text-sm flex items-center gap-x-3"
          >
            {t}
            <button
              onClick={() => removeTag(t)}
              className="text-white font-semibold text-xs"
            >
              <ImCross className="text-xs size-3" />
            </button>
          </span>
        ))}
      </div>

      {/* Submit */}
      <button
        onClick={addNote}
        className="rounded-2xl px-6 py-1 md:py-1.5 text-sm bg-red-600 hover:bg-red-600/80 shadow"
      >
        Add Note
      </button>

      <div className="border-t border-neutral-800 my-6" />

      {/* Search + Tag Filter */}
      <div className="flex gap-2 my-3">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes..."
          className="rounded-2xl flex-1 border border-neutral-700 focus:outline-none pl-3 py-1 text-sm"
        />
      </div>
      <div className="flex flex-wrap gap-2 mb-3 ml-1">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleFilterTag(tag)}
            className={`px-3 py-1 rounded-full text-xs ${
              filterTags.includes(tag)
                ? "bg-white text-black font-me"
                : "bg-neutral-700 text-white"
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Display notes */}
      <div className="my-4 md:my-8 space-y-2">
        {filteredNotes.length === 0 && (
          <p className="text-neutral-400 text-sm">No notes found.</p>
        )}
        {filteredNotes.map((note) => (
          <div
            key={note._id}
            className="bg-neutral-800 p-3 w-full flex items-center justify-between lg:pr-5 rounded-2xl"
          >
            <div>
              {note.title && (
                <p className="text-white font-semibold text-sm">{note.title}</p>
              )}
              <p className="text-white text-sm">{note.content}</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {note.tags.map((t: any) => (
                  <span
                    key={t}
                    className="bg-neutral-600 text-white px-2 py-0.5 rounded-full text-xs"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
            <button
              disabled={loadingNoteId === note._id}
              className="text-lg md:text-xl hover:font-bold"
              onClick={() => deleteNote(note._id)}
            >
              <RiDeleteBin5Line />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotesSection;
