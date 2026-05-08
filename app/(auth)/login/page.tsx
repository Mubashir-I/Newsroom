"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
            setError("Invalid credentials. Please try again.");
            setIsLoading(false);
        } else {
            router.push("/dashboard");
            router.refresh();
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 shadow-2xl w-full max-w-md flex flex-col gap-5"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h1>
                    <p className="text-slate-400 text-sm">Sign in to your secure dashboard</p>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-2 rounded-lg">
                            {error}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
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
                </div>

                <div className="flex items-center justify-between px-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            name="remember"
                            className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500/50 accent-blue-600"
                        />
                        <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">Forgot Password?</a>
                </div>

                <button
                    disabled={isLoading}
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20"
                >
                    {isLoading ? "Authenticating..." : "Sign In"}
                </button>

                <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-slate-800"></div>
                    <span className="flex-shrink mx-4 text-slate-600 text-[10px] uppercase tracking-widest font-bold">Or continue with</span>
                    <div className="flex-grow border-t border-slate-800"></div>
                </div>
                <button
                    type="button"
                    onClick={() => router.push("/signup")}
                    className="w-full bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-medium py-3 rounded-xl transition-all border border-slate-700"
                >
                    Create New Account
                </button>
            </form>
        </div>
    );
}