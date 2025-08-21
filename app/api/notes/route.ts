// /api/notes/[videoId].ts
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Note from "@/models/note.model";

export async function GET(req: Request, { params }: any) {
  await connectDB();
  const { videoId } = params;
  const notes = await Note.find({ videoId });
  return NextResponse.json(notes);
}

export async function POST(req: Request, { params }: any) {
  await connectDB();
  const body = await req.json();
  const { videoId } = params;
  const { userId, content, tags } = body;
  const note = await Note.create({ userId, videoId, content, tags });
  return NextResponse.json(note);
}
