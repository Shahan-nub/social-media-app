import { connectToDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Video from "../../../../../../models/Video";

export async function POST(req: NextRequest) {
  try {
    const { videoId } = await req.json();
    await connectToDB();

    const video = await Video.findById(videoId);

    // console.log(video.comments);
    if (!video) {
      return NextResponse.json({ message: "Invalid videoId" }, { status: 401 });
    }

    return NextResponse.json(
      {
        message: "fetched all comments successfully.",
        comments: video.comments,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "failed to fetch all comments." },
      { status: 500 }
    );
  }
}
