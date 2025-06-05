import { connectToDB } from "@/lib/db";
import Video, { IVideo } from "../../../../models/Video";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET() {
  try {
    await connectToDB();
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();

    if (!videos || videos.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(videos);
    
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch videos from db." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized to post videos." },
        { status: 400 }
      );
    }

    await connectToDB();

    const body: IVideo = await request.json();

    if (
      !body.title ||
      !body.description ||
      !body.thumbnailUrl ||
      !body.videoUrl
    ) {
      return NextResponse.json(
        { error: "Missing required field in Video." },
        { status: 401 }
      );
    }

    const videoData = {
      ...body,
      email: session.user.email,
      controls: body.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: body.transformation?.quality ?? 100,
      },
    };

    const newVideo = await Video.create(videoData);
    return NextResponse.json(newVideo);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create new video." },
      { status: 500 }
    );
  }
}
