import { DatabaseConnection } from "@/lib/Database";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/AuthOptions";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json([]);

        await DatabaseConnection();
        const user = await User.findById((session.user as any).id).select('interests');
        return NextResponse.json(user?.interests || []);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { interests } = await req.json();
        if (!Array.isArray(interests)) {
            return NextResponse.json({ message: "Interests must be an array" }, { status: 400 });
        }

        await DatabaseConnection();
        await User.findByIdAndUpdate((session.user as any).id, { interests });

        return NextResponse.json({ message: "Interests updated successfully" });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
