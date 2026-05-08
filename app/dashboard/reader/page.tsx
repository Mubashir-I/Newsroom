"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ReaderDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (session?.user && (session.user as any).role !== "reader") {
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
                <div className="w-20 h-20 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                    <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
                
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Welcome, Reader</h1>
                    <p className="text-slate-400">Signed in as <span className="text-emerald-400 font-medium">{session?.user?.name || session?.user?.email}</span></p>
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
