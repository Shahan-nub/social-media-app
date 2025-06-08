import { connectToDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Video from "../../../../../../models/Video";

export async function POST(req: NextRequest) {
  try {
    const { videoId, comment } = await req.json(); // comment: { email, text }

    if (!videoId || !comment?.email || !comment?.text) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDB();

    const video = await Video.findById(videoId);

    if (!video) {
      return NextResponse.json({ error: "video not found" }, { status: 404 });
    }

    video.comments.push({
      email: comment.email,
      text: comment.text,
      createdAt: new Date(),
    });

    await video.save();

    return NextResponse.json({ message: "Comment added successfully", video }, { status: 200 });

  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
