import { DatabaseConnection } from "@/lib/Database";
import Comment from "@/models/Comment";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/AuthOptions";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: Request, context: RouteContext) {
    try {
        const { id } = await context.params;
        await DatabaseConnection();
        const comments = await Comment.find({ article: id })
            .populate('user', 'username')
            .sort({ createdAt: -1 });
        return NextResponse.json(comments);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(req: Request, context: RouteContext) {
    try {
        const { id } = await context.params;
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { content } = await req.json();
        if (!content?.trim()) {
            return NextResponse.json({ message: "Comment content is required" }, { status: 400 });
        }

        await DatabaseConnection();
        const comment = await Comment.create({
            article: id,
            user: (session.user as any).id,
            content: content.trim(),
        });

        // Return the comment populated with user info
        const populated = await Comment.findById(comment._id).populate('user', 'username');
        return NextResponse.json(populated, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
