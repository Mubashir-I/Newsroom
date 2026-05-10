import { NextRequest, NextResponse } from "next/server";
import { DatabaseConnection } from "@/lib/Database";
import User from "@/models/User";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
    try {
        await DatabaseConnection();
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ error: "Token and new password are required" }, { status: 400 });
        }

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: new Date() }
        }).select("+password"); // Need current password field if we use it, but here we just overwrite

        if (!user) {
            return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        return NextResponse.json({ message: "Password has been reset successfully. You can now login with your new password." });
    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
