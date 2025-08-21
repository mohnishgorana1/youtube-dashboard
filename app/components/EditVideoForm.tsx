"use client";

import { VideoDetails } from "@/interfaces";
import { useEffect, useState } from "react";

export default function EditVideoForm({
  video,
  onSave,
}: {
  video: VideoDetails;
  onSave: (title: string, description: string) => Promise<void> | void;
}) {
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description);
  const [saving, setSaving] = useState(false);

  // if parent video prop changes (after save), sync form fields
  useEffect(() => {
    setTitle(video.title);
    setDescription(video.description);
  }, [video]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(title, description);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
      <span>
        <p className="font-bold">Title</p>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-xl px-2 mt-1 border border-neutral-700 p-1 w-full opacity-55"
          disabled={saving}
        />
      </span>
      <span>
        <p className="font-bold">Description</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-xl px-2 mt-1 border border-neutral-700 p-1 w-full opacity-55 max-h-48"
          disabled={saving}
        />
      </span>
      <div className="mt-2">
        <button
          type="submit"
          disabled={saving}
          className={`px-2 py-1 md:px-3 md:py-2 w-40 rounded-2xl ${
            saving ? "bg-gray-500 cursor-not-allowed" : "bg-red-500 hover:bg-red-500/80"
          } text-white`}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
