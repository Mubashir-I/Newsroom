"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle2, Lock } from "lucide-react";

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = use(params);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const password = formData.get("password");
        const confirmPassword = formData.get("confirmPassword");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                body: JSON.stringify({ token, password }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                setIsSuccess(true);
                setTimeout(() => {
                    router.push("/login");
                }, 3000);
            } else {
                setError(data.error || "Failed to reset password.");
            }
        } catch (err) {
            setError("Connection error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col font-sans text-zinc-300">
            <div className="p-6">
                <Link href="/login" className="text-zinc-500 hover:text-zinc-300 flex items-center gap-2 transition-colors w-fit text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                </Link>
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-[380px]">
                    <div className="mb-8">
                        <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center mb-6">
                            <Lock className="w-6 h-6 text-zinc-100" />
                        </div>
                        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Set New Password</h1>
                        <p className="text-sm text-zinc-500 mt-1">Create a secure password for your account</p>
                    </div>

                    {isSuccess ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-6 rounded-lg flex flex-col items-center text-center gap-3">
                            <CheckCircle2 className="w-10 h-10 mb-1" />
                            <p className="text-sm font-medium">{message}</p>
                            <p className="text-xs text-zinc-500">Redirecting to login page...</p>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm py-2.5 px-3 rounded-md mb-6">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wide">New Password</label>
                                    <input
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-md text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all sm:text-sm"
                                        required
                                        minLength={8}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wide">Confirm Password</label>
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-md text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all sm:text-sm"
                                        required
                                    />
                                </div>

                                <button
                                    disabled={isLoading}
                                    type="submit"
                                    className="w-full bg-zinc-100 hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-900 font-semibold py-2.5 rounded-md transition-colors flex items-center justify-center gap-2 mt-2 text-sm"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reset Password"}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
