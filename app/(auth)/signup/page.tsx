"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const username = formData.get("username");
        const password = formData.get("password");
        const role = formData.get("role");

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, username, password, role }),
            });

            if (res.ok) {
                router.push("/login");
            } else {
                const data = await res.json();
                setError(data.message || "Something went wrong");
            }
        } catch (err) {
            setError("Failed to create account");
        } finally {
            setIsLoading(false);
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
                        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Create Account</h1>
                        <p className="text-sm text-zinc-500 mt-1">Join the campus news platform</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm py-2.5 px-3 rounded-md mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wide">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="alice@example.com"
                                    className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-md text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all sm:text-sm"
                                    required
                                />
                            </div>
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
                                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wide">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-md text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wide">Account Type</label>
                                <select
                                    name="role"
                                    className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-md text-zinc-200 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all sm:text-sm"
                                    defaultValue="reader"
                                >
                                    <option value="reader">Reader</option>
                                    <option value="writer">Writer</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>
                        </div>

                        <button
                            disabled={isLoading}
                            type="submit"
                            className="w-full bg-zinc-100 hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-900 font-semibold py-2.5 rounded-md transition-colors flex items-center justify-center gap-2 mt-2 text-sm"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign Up"}
                        </button>

                        <div className="text-left mt-4 border-t border-zinc-900 pt-6">
                            <p className="text-zinc-500 text-sm">
                                Already registered?{" "}
                                <Link href="/login" className="text-zinc-300 hover:text-zinc-100 transition-colors font-medium">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
