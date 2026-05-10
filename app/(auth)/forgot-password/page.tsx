"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, MessageSquare, Phone } from "lucide-react";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [whatsappUrl, setWhatsappUrl] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const identifier = formData.get("identifier");
        const phone = formData.get("phone") as string;

        // Clean phone number (remove +, spaces, etc.)
        const cleanPhone = phone.replace(/\D/g, "");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                body: JSON.stringify({ identifier }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();

            if (res.ok) {
                const message = `Hello! Here is your Newsroom password reset link: ${data.resetUrl}\n\nNote: This link expires in 1 hour.`;
                const encodedMessage = encodeURIComponent(message);
                const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;
                
                setWhatsappUrl(waUrl);
                setIsSuccess(true);
            } else {
                setError(data.error || "User not found.");
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
                <div className="w-full max-w-[400px]">
                    <div className="mb-8">
                        <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mb-6">
                            <MessageSquare className="w-6 h-6 text-emerald-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">WhatsApp Reset</h1>
                        <p className="text-sm text-zinc-500 mt-1">Provide your details to receive a reset link via WhatsApp</p>
                    </div>

                    {isSuccess ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-6 rounded-lg flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                <Phone className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Link Generated!</h3>
                                <p className="text-sm opacity-90">Click the button below to send the reset link to your WhatsApp number.</p>
                            </div>
                            <a 
                                href={whatsappUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-md transition-all flex items-center justify-center gap-2"
                            >
                                Send to WhatsApp
                            </a>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm py-2.5 px-3 rounded-md mb-6">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wide">Username or Email</label>
                                    <input
                                        name="identifier"
                                        placeholder="Enter your account details"
                                        className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-md text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wide">WhatsApp Number</label>
                                    <input
                                        name="phone"
                                        type="tel"
                                        placeholder="e.g. 923001234567"
                                        className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-md text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                        required
                                    />
                                    <p className="text-[10px] text-zinc-500 mt-2 italic">Include country code without + (e.g. 92 for Pakistan)</p>
                                </div>

                                <button
                                    disabled={isLoading}
                                    type="submit"
                                    className="w-full bg-zinc-100 hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-900 font-bold py-3 rounded-md transition-colors flex items-center justify-center gap-2 mt-2"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generate Reset Link"}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
