import { DatabaseConnection } from "@/lib/Database";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/AuthOptions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { authorId } = await req.json();
        if (!authorId) {
            return NextResponse.json({ message: "Author ID is required" }, { status: 400 });
        }

        const userId = (session.user as any).id;
        if (userId === authorId) {
            return NextResponse.json({ message: "You cannot follow yourself" }, { status: 400 });
        }

        await DatabaseConnection();

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const isFollowing = user.following.includes(authorId);
        if (isFollowing) {
            user.following = user.following.filter((id: any) => id.toString() !== authorId);
        } else {
            user.following.push(authorId);
        }

        await user.save();
        return NextResponse.json({ following: !isFollowing });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
