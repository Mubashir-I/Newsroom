import { DatabaseConnection } from "@/lib/Database";
import { hash, validatePassword } from "@/lib/Security";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { email, username, password, role } = await req.json();

        if (!email || !username || !password) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        try {
            validatePassword(password);
        } catch (error: any) {
            return NextResponse.json({ message: error.message }, { status: 400 });
        }

        await DatabaseConnection();

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return NextResponse.json({ message: "Email or Username already taken" }, { status: 400 });
        }

        const hashedPassword = await hash(password);
        
        const newUser = await User.create({
            email,
            username,
            password: hashedPassword,
            role: role || 'reader'
        });

        return NextResponse.json({ message: "User created successfully" }, { status: 201 });
    } catch (error: any) {
        console.error("Signup error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
