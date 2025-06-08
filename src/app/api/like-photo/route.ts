// POST /api/like-photo
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Photo from "../../../../models/Photo";

export async function POST(req: NextRequest) {
  try {
    const { photoId, activeUserEmail } = await req.json();
    await connectToDB();

    const photo = await Photo.findById(photoId);
    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }
    // console.log(activeUserEmail)
    const hasLiked = photo.likedBy.includes(activeUserEmail);
    // console.log("has liked: ", hasLiked);
    const update = hasLiked
      ? {
          $pull: { likedBy: activeUserEmail },
          $inc: { likeCount: -1 }
        }
      : {
          $addToSet: { likedBy: activeUserEmail },
          $inc: { likeCount: 1 }
        };

    await Photo.updateOne({ _id: photoId }, update);

    return NextResponse.json({
      message: hasLiked ? "Unliked" : "Liked"
    }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
