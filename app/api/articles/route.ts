import { DatabaseConnection } from "@/lib/Database";
import Article from "@/models/Article";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/AuthOptions";

export async function GET(req: any) {
    try {
        await DatabaseConnection();
        const { searchParams } = req.nextUrl;
        const category = searchParams.get('category');
        const author = searchParams.get('author');
        const statusParam = searchParams.get('status');
        
        let query: any = {};
        
        if (statusParam && statusParam !== 'all') {
            query.status = statusParam;
        } else if (statusParam === 'all') {
            // No status filter
        } else {
            query.status = 'published';
        }

        if (category) query.category = category;
        if (author) query.author = author;

        const articles = await Article.find(query)
            .populate('author', 'username email')
            .sort({ createdAt: -1 });

        return NextResponse.json(articles);
    } catch (error: any) {
        console.error("API GET Articles Error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions); 
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { title, content, category, tags, coverImage, status } = body;

        await DatabaseConnection();

        const article = await Article.create({
            title,
            content,
            category,
            tags,
            coverImage,
            status: status || 'draft',
            author: (session.user as any).id
        });

        return NextResponse.json(article, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
