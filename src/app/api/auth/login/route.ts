import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import User from "../../../../../models/User";

export async function POST(request: NextRequest) {
    try {
        const {email, password} = await request.json();

        if(!email || !password){
            return NextResponse.json(
                {error: "Email, password and are required fields."},
                {status: 400}
            )
        }

        await connectToDB()

        const existingUser = await User.findOne({email})

        if(!existingUser){
            return NextResponse.json(
                {error: "Email is not registered."},
                {status: 400}
            )
        }

        return NextResponse.json(
            {message: "User logged in successfully."},
            {status:200}
        );

    } catch (error) {
        return NextResponse.json(
            {error: "Failed to login the user."},
            {status:500}
        )
    }
}

