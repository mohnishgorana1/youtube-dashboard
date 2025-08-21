'use client'

import { useState } from "react";

function ReplyForm({
  commentId,
  onReply,
}: {
  commentId: string;
  onReply: (commentId: string, text: string) => void;
}) {
  const [reply, setReply] = useState("");
  return (
    <div className="mt-1">
      <input
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Reply..."
        className="border p-1 w-full text-sm"
      />
      <button
        onClick={() => {
          onReply(commentId, reply);
          setReply("");
        }}
        className="mt-1 bg-gray-500 text-white px-2 py-0.5 text-sm"
      >
        Reply
      </button>
    </div>
  );
}
