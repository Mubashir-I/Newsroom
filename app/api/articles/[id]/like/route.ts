import { DatabaseConnection } from "@/lib/Database";
import Article from "@/models/Article";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/AuthOptions";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: Request, context: RouteContext) {
    try {
        const { id } = await context.params;
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        await DatabaseConnection();

        const article = await Article.findById(id);
        if (!article) {
            return NextResponse.json({ message: "Article not found" }, { status: 404 });
        }

        const hasLiked = article.likes.some((likeId: any) => likeId.toString() === userId);
        if (hasLiked) {
            article.likes = article.likes.filter((likeId: any) => likeId.toString() !== userId);
        } else {
            article.likes.push(userId);
        }

        await article.save();
        return NextResponse.json({ liked: !hasLiked, count: article.likes.length });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
