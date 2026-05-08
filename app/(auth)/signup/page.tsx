"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
        <div className="min-h-[85vh] flex items-center justify-center px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 shadow-2xl w-full max-w-md flex flex-col gap-5"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h1>
                    <p className="text-slate-400 text-sm">Join our secure newsroom community</p>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-2 rounded-lg">
                            {error}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <input
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                        required
                    />
                    <input
                        name="username"
                        placeholder="Username"
                        className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                        required
                    />
                    <select
                        name="role"
                        className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-200 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all appearance-none"
                        defaultValue="reader"
                    >
                        <option value="reader">Reader</option>
                        <option value="writer">Writer</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <button
                    disabled={isLoading}
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20"
                >
                    {isLoading ? "Creating Account..." : "Sign Up"}
                </button>

                <div className="text-center">
                    <p className="text-slate-400 text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}
