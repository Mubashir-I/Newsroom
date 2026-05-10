import { DatabaseConnection } from "@/lib/Database";
import Article from "@/models/Article";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/AuthOptions";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: Request, context: RouteContext) {
    try {
        const { id } = await context.params;
        await DatabaseConnection();
        const article = await Article.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } },
            { new: true }
        ).populate('author', 'username email');

        if (!article) {
            return NextResponse.json({ message: "Article not found" }, { status: 404 });
        }
        return NextResponse.json(article);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request, context: RouteContext) {
    try {
        const { id } = await context.params;
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        await DatabaseConnection();
        const body = await req.json();

        const article = await Article.findById(id);
        if (!article) return NextResponse.json({ message: "Not found" }, { status: 404 });

        // Only author or admin can update
        if (article.author.toString() !== (session.user as any).id && (session.user as any).role !== 'admin') {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const updated = await Article.findByIdAndUpdate(id, body, { new: true });
        return NextResponse.json(updated);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, context: RouteContext) {
    try {
        const { id } = await context.params;
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        await DatabaseConnection();
        const article = await Article.findById(id);
        if (!article) return NextResponse.json({ message: "Not found" }, { status: 404 });

        if (article.author.toString() !== (session.user as any).id && (session.user as any).role !== 'admin') {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await Article.findByIdAndDelete(id);
        return NextResponse.json({ message: "Deleted" });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
