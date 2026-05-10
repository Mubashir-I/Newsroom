import { NextResponse } from "next/server";
import { DatabaseConnection } from "@/lib/Database";
import Article from "@/models/Article";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/AuthOptions";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const { searchParams } = new URL(req.url);
        const authorId = searchParams.get("authorId");
        const status = searchParams.get("status");

        await DatabaseConnection();

        let query: any = {};
        if (authorId) query.author = authorId;
        if (status) query.status = status;

        // Readers fetch only published
        if (!session || ((session.user as any).role === "reader")) {
            query.status = "published";
        }

        const articles = await Article.find(query).populate({ path: 'author', select: 'username email' }).sort({ createdAt: -1 });

        return NextResponse.json({ articles }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["writer", "admin"].includes((session.user as any).role)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { title, subtitle, content, category, coverImage, status } = body;

        await DatabaseConnection();

        // Fallback stub definition since `Article.ts` only has `content`, `title`, etc. Wait, I should make sure my frontend maps to `Article` model properties.
        const newArticle = await Article.create({
            title,
            content,
            category,
            coverImage: coverImage || '',
            status: status || 'draft',
            author: (session.user as any).id
        });

        return NextResponse.json({ article: newArticle }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: "Internal Error", error: error.message }, { status: 500 });
    }
}
