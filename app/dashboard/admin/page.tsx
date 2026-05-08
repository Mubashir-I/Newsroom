"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (session?.user && (session.user as any).role !== "admin") {
            router.push(`/dashboard/${(session.user as any).role}`);
        }
    }, [session, status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl text-center space-y-6">
                <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto border border-blue-500/30">
                    <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Welcome, Admin</h1>
                    <p className="text-slate-400">Signed in as <span className="text-blue-400 font-medium">{session?.user?.name || session?.user?.email}</span></p>
                </div>

                <div className="pt-4">
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="w-full bg-red-600/10 hover:bg-red-600 border border-red-600/50 text-red-500 hover:text-white font-semibold py-3 rounded-xl transition-all duration-300"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
