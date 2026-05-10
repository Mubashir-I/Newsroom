import { NextResponse } from "next/server";
import { DatabaseConnection } from "@/lib/Database";
import Article from "@/models/Article";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/AuthOptions";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await DatabaseConnection();

        // We update views atomically when someone reads
        const article = await Article.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true }).populate('author', 'username email');

        if (!article) return NextResponse.json({ message: "Not found" }, { status: 404 });

        // Security: If draft, only author or admin can see it
        if (article.status === 'draft') {
            const session = await getServerSession(authOptions);
            const isAuthor = session?.user?.email === (article.author as any)?.email;
            const isAdmin = (session?.user as any)?.role === 'admin';

            if (!isAuthor && !isAdmin) {
                return NextResponse.json({ message: "Not found" }, { status: 404 }); // Hide existence
            }
        }

        return NextResponse.json({ article }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["writer", "admin"].includes((session.user as any).role)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();

        await DatabaseConnection();

        // Ideally ensure writer is authoring it
        const article = await Article.findByIdAndUpdate(id, body, { new: true });

        return NextResponse.json({ article }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["writer", "admin"].includes((session.user as any).role)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const { id } = await params;
        await DatabaseConnection();
        await Article.findByIdAndDelete(id);

        return NextResponse.json({ message: "Deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
