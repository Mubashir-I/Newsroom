"use client";

import { useSession } from "next-auth/react";
import { Clock, TrendingUp, ThumbsUp, MessageSquare, Bookmark, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ReaderDashboard() {
    const { data: session } = useSession();
    const [articles, setArticles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [interests, setInterests] = useState<string[]>([]);

    const userName = session?.user?.name || (session?.user as any)?.email?.split("@")[0] || "Reader";

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch interests first
                const intRes = await fetch('/api/users/interests');
                const userInterests = intRes.ok ? await intRes.json() : [];
                setInterests(userInterests);

                // Fetch articles
                const res = await fetch('/api/articles?status=published');
                if (res.ok) {
                    const data = await res.json();
                    
                    // Simple recommendation: put articles matching interests first
                    const sorted = [...data].sort((a, b) => {
                        const aMatches = userInterests.includes(a.category.toLowerCase()) ? 1 : 0;
                        const bMatches = userInterests.includes(b.category.toLowerCase()) ? 1 : 0;
                        return bMatches - aMatches;
                    });
                    
                    setArticles(sorted);
                }
            } catch (err) {
                console.error("Failed to fetch reader data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [session]);

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    const featured = articles[0];
    const others = articles.slice(1);

    return (
        <div className="space-y-8 pb-12">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-900">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-100 mb-1">Good morning, {userName}</h1>
                    <p className="text-zinc-500 text-sm">Here's the latest news curated just for you.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md hover:bg-zinc-800 transition-colors text-xs font-semibold text-zinc-300">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Trending
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md hover:bg-zinc-800 transition-colors text-xs font-semibold text-zinc-300">
                        <Clock className="w-3.5 h-3.5" />
                        Recent
                    </button>
                </div>
            </div>

            {articles.length === 0 ? (
                <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-12 text-center text-zinc-500">
                    No articles published yet. Check back later!
                </div>
            ) : (
                <>
                    {/* Featured Article */}
                    {featured && (
                        <div className="group rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 flex flex-col md:flex-row">
                            <div className="relative w-full md:w-2/5 min-h-[250px] bg-zinc-900">
                                {featured.coverImage ? (
                                    <Image
                                        src={featured.coverImage}
                                        alt="Featured cover"
                                        fill
                                        className="object-cover opacity-80"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-700">No Image</div>
                                )}
                            </div>

                            <div className="p-6 md:p-8 flex flex-col justify-center flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-2 py-0.5 border border-zinc-700 bg-zinc-900 text-zinc-300 text-[10px] font-bold uppercase tracking-wider rounded-sm">
                                        {featured.category}
                                    </span>
                                </div>
                                <Link href={`/articles/${featured._id}`}>
                                    <h2 className="text-2xl md:text-3xl font-bold text-zinc-100 leading-tight mb-3 hover:underline cursor-pointer">
                                        {featured.title}
                                    </h2>
                                </Link>
                                <p className="text-zinc-400 text-sm max-w-xl mb-6 leading-relaxed line-clamp-3">
                                    {featured.content.substring(0, 200)}...
                                </p>
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-md bg-zinc-900 flex items-center justify-center font-bold text-zinc-300 border border-zinc-800 text-xs">
                                            {featured.author?.username?.charAt(0) || 'A'}
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-zinc-200">{featured.author?.username || 'Unknown'}</p>
                                            <p className="text-[10px] text-zinc-500">{new Date(featured.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="flex items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors text-xs font-medium">
                                            <ThumbsUp className="w-3.5 h-3.5" /> {featured.likes?.length || 0}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Others Grid */}
                    {others.length > 0 && (
                        <div>
                            <h3 className="text-lg font-bold text-zinc-200 mb-4 flex items-center gap-2">
                                More Stories
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {others.map((article) => (
                                    <div key={article._id} className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden flex flex-col">
                                        <div className="h-40 relative bg-zinc-900 border-b border-zinc-800">
                                            {article.coverImage && (
                                                <Image src={article.coverImage} alt="Cover" fill className="object-cover opacity-80" />
                                            )}
                                        </div>
                                        <div className="p-4 flex-1 flex flex-col">
                                            <div className="mb-2">
                                                <span className="px-2 py-0.5 border border-zinc-800 bg-zinc-900 text-zinc-400 text-[10px] font-bold uppercase tracking-wider rounded-sm">
                                                    {article.category}
                                                </span>
                                            </div>
                                            <Link href={`/articles/${article._id}`}>
                                                <h4 className="text-base font-bold text-zinc-100 mb-2 leading-tight hover:underline cursor-pointer">
                                                    {article.title}
                                                </h4>
                                            </Link>
                                            <p className="text-zinc-400 text-xs mb-4 line-clamp-3 leading-relaxed flex-1">
                                                {article.content.substring(0, 150)}...
                                            </p>
                                            <div className="pt-4 border-t border-zinc-900 flex items-center justify-between mt-auto">
                                                <span className="text-xs font-medium text-zinc-300">{article.author?.username}</span>
                                                <span className="text-[10px] text-zinc-500">{new Date(article.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

        </div>
    );
}
