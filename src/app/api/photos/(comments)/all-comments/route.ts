import { connectToDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Photo from "../../../../../../models/Photo";

export async function POST(req: NextRequest) {
  try {
    const { photoId } = await req.json();
    await connectToDB();

    const photo = await Photo.findById(photoId);

    // console.log(photo.comments);
    if (!photo) {
      return NextResponse.json({ message: "Invalid photoId" }, { status: 401 });
    }

    return NextResponse.json(
      {
        message: "fetched all comments successfully.",
        comments: photo.comments,
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
