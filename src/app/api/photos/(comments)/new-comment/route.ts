import { connectToDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Photo from "../../../../../../models/Photo";

export async function POST(req: NextRequest) {
  try {
    const { photoId, comment } = await req.json(); // comment: { email, text }

    if (!photoId || !comment?.email || !comment?.text) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDB();

    const photo = await Photo.findById(photoId);

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    photo.comments.push({
      email: comment.email,
      text: comment.text,
      createdAt: new Date(),
    });

    await photo.save();

    return NextResponse.json({ message: "Comment added successfully", photo }, { status: 200 });

  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
