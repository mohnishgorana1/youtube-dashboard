import { NextResponse } from "next/server";
import Video from "@/models/Video";
import connectDB from "@/config/db";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;

  try {
    const body = await req.json();
    const { title, description } = body;

    const updatedVideo = await Video.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!updatedVideo) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json(updatedVideo, { status: 200 });
  } catch (err) {
    console.error("Error updating video:", err);
    return NextResponse.json({ error: "Failed to update video" }, { status: 500 });
  }
}
