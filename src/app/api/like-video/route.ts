// POST /api/like-video
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Video from "../../../../models/Video";

export async function POST(req: NextRequest) {
  try {
    const { videoId, activeUserEmail } = await req.json();
    await connectToDB();

    const video = await Video.findById(videoId);
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // console.log(activeUserEmail)
    const hasLiked = video.likedBy.includes(activeUserEmail);
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

    await Video.updateOne({ _id: videoId }, update);

    return NextResponse.json({
      message: hasLiked ? "Unliked" : "Liked"
    }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
