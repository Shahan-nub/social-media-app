import { connectToDB } from "@/lib/db";
import Photo, { IPhoto } from "../../../../models/Photo";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET() {
  try {
    await connectToDB();

    const photos = await Photo.find({}).sort({ createdAt: -1 }).lean();

    if (!photos || photos.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(photos);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch photos from db." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized to post photos." },
        { status: 400 }
      );
    }

    await connectToDB();

    const body: IPhoto = await request.json();

    if (
      !body.title ||
      !body.description ||
      !body.photoUrl
    ) {
      return NextResponse.json(
        { error: "Missing required field in Photo." },
        { status: 401 }
      );
    }

    const photoData = {
      ...body,
      email: session.user.email,
      controls: body.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: body.transformation?.quality ?? 100,
      },
    };

    const newPhoto = await Photo.create(photoData);
    return NextResponse.json(newPhoto);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create new photo." },
      { status: 500 }
    );
  }
}
