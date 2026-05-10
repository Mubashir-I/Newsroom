import { NextRequest, NextResponse } from "next/server";
import { DatabaseConnection } from "@/lib/Database";
import User from "@/models/User";
import crypto from "crypto";
import { sendResetEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
    try {
        await DatabaseConnection();
        const { identifier } = await req.json(); // identifier can be email or username

        if (!identifier) {
            return NextResponse.json({ error: "Email or username is required" }, { status: 400 });
        }

        const user = await User.findOne({
            $or: [{ email: identifier.toLowerCase() }, { username: identifier }]
        });

        if (!user) {
            // For security reasons, don't reveal if user exists or not
            return NextResponse.json({ message: "If an account exists with this email/username, a reset link has been sent." });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${resetToken}`;
        
        return NextResponse.json({ 
            message: "Reset link generated successfully.",
            resetUrl 
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
