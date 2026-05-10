"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const username = formData.get("username");
        const password = formData.get("password");
        const remember = formData.get("remember") === "on";

        const result = await signIn("credentials", {
            username,
            password,
            remember,
            redirect: false,
        });

        if (result?.error) {
            setError("Invalid username or password. Please try again.");
            setIsLoading(false);
        } else {
            // /dashboard auto-dispatches to the correct role page
            router.push("/dashboard");
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col font-sans text-zinc-300">
            <div className="p-6">
                <Link href="/" className="text-zinc-500 hover:text-zinc-300 flex items-center gap-2 transition-colors w-fit text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Link>
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-[380px]">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Login</h1>
                        <p className="text-sm text-zinc-500 mt-1">Enter your credentials to continue</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm py-2.5 px-3 rounded-md mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wide">Username</label>
                                <input
                                    name="username"
                                    placeholder="alice123"
                                    className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-md text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide">Password</label>
                                    <Link href="/forgot-password" title="Click here to reset your password" className="text-xs text-zinc-500 hover:text-zinc-300">Forgot?</Link>
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-md text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all sm:text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                            <input
                                type="checkbox"
                                name="remember"
                                id="remember"
                                className="w-3.5 h-3.5 rounded-sm border-zinc-700 bg-zinc-950 text-zinc-100 focus:ring-1 focus:ring-zinc-500 focus:ring-offset-zinc-950"
                            />
                            <label htmlFor="remember" className="text-sm text-zinc-400 select-none cursor-pointer">
                                Remember 30 days
                            </label>
                        </div>

                        <button
                            disabled={isLoading}
                            type="submit"
                            className="w-full bg-zinc-100 hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-900 font-semibold py-2.5 rounded-md transition-colors flex items-center justify-center gap-2 mt-4 text-sm"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
                        </button>

                        <div className="text-left mt-6 border-t border-zinc-900 pt-6">
                            <p className="text-zinc-500 text-sm">
                                No account?{" "}
                                <Link href="/signup" className="text-zinc-300 hover:text-zinc-100 transition-colors font-medium">
                                    Create one
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}