import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import User from "../../../../../models/User";

export async function POST(request: NextRequest) {
    try {
        const {email, password, username} = await request.json();

        if(!email || !password || !username){
            return NextResponse.json(
                {error: "Email, password and username are required fields."},
                {status: 400}
            )
        }

        await connectToDB()

        const existingUser = await User.findOne({email})
        if(existingUser){
            return NextResponse.json(
                {error: "Email is already registered."},
                {status: 400}
            )
        }

        await User.create({
            email,
            password,
            username
        })

        return NextResponse.json(
            {message: "User registered successfully."},
            {status:200}
        );

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {error: "Failed to register the user."},
            {status:500}
        )
    }
}
