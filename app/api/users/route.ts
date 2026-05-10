import { NextResponse } from "next/server";
import { DatabaseConnection } from "@/lib/Database";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/AuthOptions";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        await DatabaseConnection();
        const users = await User.find({ isSystem: { $ne: true } }).select("-password").sort({ createdAt: -1 });

        return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
