import { NextResponse } from "next/server";
import { DatabaseConnection } from "@/lib/Database";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/AuthOptions";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();
        const { role, isActive } = body;

        await DatabaseConnection();

        // Validate role if passed
        if (role && !["admin", "writer", "reader"].includes(role)) {
            return NextResponse.json({ message: "Invalid role" }, { status: 400 });
        }

        const updates: any = {};
        if (role) updates.role = role;
        if (typeof isActive === 'boolean') updates.isActive = isActive;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        ).select("-password");

        return NextResponse.json({ user: updatedUser }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const { id } = await params;

        // Prevent self-deletion
        if (id === (session.user as any).id) {
            return NextResponse.json({ message: "Cannot delete yourself" }, { status: 400 });
        }

        await DatabaseConnection();
        await User.findByIdAndDelete(id);

        return NextResponse.json({ message: "User deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
