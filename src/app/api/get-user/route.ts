// /api/login/route.ts (or your relevant route)
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import User from "../../../../models/User";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required to get user details." },
        { status: 400 }
      );
    }

    await connectToDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Email is not registered." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "User fetched successfully.", data: user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch the user." },
      { status: 500 }
    );
  }
}
