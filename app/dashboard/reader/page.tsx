"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Clock, TrendingUp, ThumbsUp, MessageSquare, Bookmark, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ReaderDashboard() {
    const { data: session } = useSession();
    const userName = session?.user?.name || (session?.user as any)?.email?.split("@")[0] || "Reader";

    const [articles, setArticles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchFeed = async () => {
        try {
            const res = await fetch("/api/articles?status=published");
            const data = await res.json();
            if (res.ok) setArticles(data.articles || []);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFeed();
    }, []);

    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const sq = params.get("search");
            if (sq) setSearchQuery(sq.toLowerCase());
        }
    }, []);

    const displayedArticles = searchQuery
        ? articles.filter(a =>
            a.title.toLowerCase().includes(searchQuery) ||
            a.category.toLowerCase().includes(searchQuery)
        )
        : articles;

    const featured = displayedArticles.length > 0 ? displayedArticles[0] : null;
    const gridArticles = displayedArticles.length > 1 ? displayedArticles.slice(1) : [];

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-900">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-100 mb-1">
                        {searchQuery ? `Search Results: "${searchQuery}"` : `Good morning, ${userName}`}
                    </h1>
                    <p className="text-zinc-500 text-sm">
                        {searchQuery ? `Found ${displayedArticles.length} matching stories.` : "Here's the latest news curated just for you."}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md hover:bg-zinc-800 transition-colors text-xs font-semibold text-zinc-300">
                        <TrendingUp className="w-3.5 h-3.5" /> Trending
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md hover:bg-zinc-800 transition-colors text-xs font-semibold text-zinc-300">
                        <Clock className="w-3.5 h-3.5" /> Recent
                    </button>
                </div>
            </div>

            {isLoading && (
                <div className="flex items-center justify-center p-20">
                    <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
                </div>
            )}

            {!isLoading && articles.length === 0 && (
                <div className="text-center p-20 bg-zinc-950 border border-zinc-900 rounded-lg text-zinc-500">
                    <p>No stories published yet. Check back later!</p>
                </div>
            )}

            {!isLoading && featured && (
                <div className="group rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 flex flex-col md:flex-row">
                    <div className="relative w-full md:w-2/5 min-h-[250px] bg-zinc-900">
                        <img
                            src={featured.coverImage || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop"}
                            alt="Featured cover"
                            className="absolute inset-0 w-full h-full object-cover opacity-80"
                        />
                    </div>

                    <div className="p-6 md:p-8 flex flex-col justify-center flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-2 py-0.5 border border-zinc-700 bg-zinc-900 text-zinc-300 text-[10px] font-bold uppercase tracking-wider rounded-sm">
                                {featured.category}
                            </span>
                        </div>
                        <Link href={`/dashboard/reader/${featured._id}`}>
                            <h2 className="text-2xl md:text-3xl font-bold text-zinc-100 leading-tight mb-3 hover:underline cursor-pointer">
                                {featured.title}
                            </h2>
                        </Link>
                        <p className="text-zinc-400 text-sm max-w-xl mb-6 leading-relaxed line-clamp-2">
                            {featured.content.replace(/<[^>]+>/g, '')}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-md bg-zinc-900 flex items-center justify-center font-bold text-zinc-300 border border-zinc-800 text-xs uppercase">
                                    {featured.author?.username?.charAt(0) || "W"}
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-zinc-200">{featured.author?.username || "Unknown"}</p>
                                    <p className="text-[10px] text-zinc-500">{new Date(featured.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors text-xs font-medium">
                                    <ThumbsUp className="w-3.5 h-3.5" /> {featured.likes?.length || 0}
                                </button>
                                <button className="flex items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors text-xs font-medium">
                                    <MessageSquare className="w-3.5 h-3.5" /> {featured.comments || 0}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!isLoading && gridArticles.length > 0 && (
                <div>
                    <h3 className="text-lg font-bold text-zinc-200 mb-4 flex items-center gap-2">More Stories</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gridArticles.map((article) => (
                            <div key={article._id} className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden flex flex-col group">
                                <div className="h-40 relative bg-zinc-900 border-b border-zinc-800">
                                    <img src={article.coverImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                                </div>
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="mb-2">
                                        <span className="px-2 py-0.5 border border-zinc-800 bg-zinc-900 text-zinc-400 text-[10px] font-bold uppercase tracking-wider rounded-sm">
                                            {article.category}
                                        </span>
                                    </div>
                                    <Link href={`/dashboard/reader/${article._id}`}>
                                        <h4 className="text-base font-bold text-zinc-100 mb-2 leading-tight group-hover:underline cursor-pointer">
                                            {article.title}
                                        </h4>
                                    </Link>
                                    <p className="text-zinc-400 text-xs mb-4 line-clamp-3 leading-relaxed flex-1">
                                        {article.content.replace(/<[^>]+>/g, '')}
                                    </p>
                                    <div className="pt-4 border-t border-zinc-900 flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium text-zinc-300">{article.author?.username}</span>
                                        </div>
                                        <span className="text-[10px] text-zinc-500"><Clock className="w-3 h-3 inline pb-0.5" /> {new Date(article.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
