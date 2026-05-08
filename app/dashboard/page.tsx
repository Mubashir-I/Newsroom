"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardDispatcher() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated" && session?.user) {
            const role = (session.user as any).role || "reader";
            router.push(`/dashboard/${role}`);
        }
    }, [session, status, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
}
