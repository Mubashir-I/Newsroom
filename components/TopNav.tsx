"use client";

import { useSession } from "next-auth/react";
import { Bell, Search, User as UserIcon, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function TopNav() {
    const { data: session } = useSession();
    const router = useRouter();
    const [query, setQuery] = useState("");
    const userName = session?.user?.name || (session?.user as any)?.email?.split("@")[0] || "User";
    const role = (session?.user as any)?.role || "reader";

    const getRoleColor = () => {
        switch (role) {
            case "admin": return "text-zinc-400 border-zinc-700 bg-zinc-800/50";
            case "writer": return "text-zinc-400 border-zinc-700 bg-zinc-800/50";
            default: return "text-zinc-400 border-zinc-800 bg-zinc-900";
        }
    };

    return (
        <header className="h-16 bg-zinc-950 border-b border-zinc-900 flex items-center justify-between px-6 shrink-0 z-40">
            <div className="flex items-center gap-4">
                {/* Mobile menu button */}
                <button className="md:hidden p-1.5 text-zinc-400 hover:text-zinc-200 rounded-md hover:bg-zinc-900 transition-colors">
                    <Menu className="w-5 h-5" />
                </button>

                {/* Search */}
                <form
                    onSubmit={(e) => { e.preventDefault(); if (query.trim()) router.push(`/dashboard/reader?search=${encodeURIComponent(query)}`); }}
                    className="hidden sm:flex items-center relative"
                >
                    <Search className="w-4 h-4 absolute left-3 text-zinc-500" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search..."
                        className="bg-zinc-950 border border-zinc-800 text-sm text-zinc-200 placeholder:text-zinc-600 rounded-md pl-9 pr-3 py-1.5 focus:outline-none focus:border-zinc-500 transition-colors w-64 text-sm"
                    />
                </form>
            </div>

            <div className="flex items-center gap-5">
                {/* Notifications */}
                <button
                    onClick={() => alert("You have no new notifications.")}
                    className="relative text-zinc-400 hover:text-zinc-200 transition-colors hidden sm:block"
                >
                    <Bell className="w-4 h-4" />
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-zinc-100 rounded-full flex items-center justify-center">
                    </span>
                </button>

                {/* Profile */}
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end hidden sm:flex">
                        <span className="text-sm font-semibold text-zinc-200 leading-tight">{userName}</span>
                        <span className={`text-[10px] uppercase font-bold px-1.5 rounded-sm border ${getRoleColor()}`}>
                            {role}
                        </span>
                    </div>
                    <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-zinc-400" />
                    </div>
                </div>
            </div>
        </header>
    );
}
