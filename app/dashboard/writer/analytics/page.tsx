"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { TrendingUp, ThumbsUp, Eye, FileText, MessageSquare, Loader2, BarChart2 } from "lucide-react";
import Link from "next/link";

export default function WriterAnalyticsPage() {
    const { data: session } = useSession();
    const [articles, setArticles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!session?.user) return;
            try {
                const res = await fetch(`/api/articles?author=${(session.user as any).id}&status=all`);
                if (res.ok) setArticles(await res.json());
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [session]);

    if (isLoading) return (
        <div className="min-h-[400px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
        </div>
    );

    const published = articles.filter(a => a.status === 'published');
    const drafts = articles.filter(a => a.status === 'draft');
    const totalViews = articles.reduce((s, a) => s + (a.views || 0), 0);
    const totalLikes = articles.reduce((s, a) => s + (a.likes?.length || 0), 0);

    // Engagement rate: likes / views * 100
    const engagementRate = totalViews > 0 ? ((totalLikes / totalViews) * 100).toFixed(1) : '0.0';

    // Top articles by likes
    const topArticles = [...published].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)).slice(0, 5);

    const statCards = [
        { label: "Published", value: published.length, icon: FileText, desc: "Live articles" },
        { label: "Drafts", value: drafts.length, icon: BarChart2, desc: "In progress" },
        { label: "Total Views", value: totalViews.toLocaleString(), icon: Eye, desc: "All time" },
        { label: "Total Likes", value: totalLikes.toLocaleString(), icon: ThumbsUp, desc: "Reader reactions" },
    ];

    return (
        <div className="space-y-8 pb-12">
            <div className="pb-6 border-b border-zinc-900">
                <h1 className="text-2xl font-bold text-zinc-100">Analytics</h1>
                <p className="text-zinc-500 text-sm mt-1">Track your content performance and reader engagement.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => (
                    <div key={stat.label} className="bg-zinc-950 border border-zinc-800 p-5 rounded-lg flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
                            <stat.icon className="w-4 h-4 text-zinc-700" />
                        </div>
                        <p className="text-3xl font-bold text-zinc-100">{stat.value}</p>
                        <p className="text-zinc-600 text-xs">{stat.desc}</p>
                    </div>
                ))}
            </div>

            {/* Engagement Summary */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6">
                <h2 className="text-base font-semibold text-zinc-100 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-zinc-500" />
                    Engagement Overview
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                        <p className="text-zinc-500 text-xs mb-1">Engagement Rate</p>
                        <p className="text-2xl font-bold text-zinc-100">{engagementRate}%</p>
                        <p className="text-zinc-600 text-xs mt-1">Likes per view</p>
                    </div>
                    <div>
                        <p className="text-zinc-500 text-xs mb-1">Avg Likes / Article</p>
                        <p className="text-2xl font-bold text-zinc-100">
                            {published.length > 0 ? (totalLikes / published.length).toFixed(1) : '0'}
                        </p>
                        <p className="text-zinc-600 text-xs mt-1">Across published content</p>
                    </div>
                    <div>
                        <p className="text-zinc-500 text-xs mb-1">Publication Rate</p>
                        <p className="text-2xl font-bold text-zinc-100">
                            {articles.length > 0 ? Math.round((published.length / articles.length) * 100) : 0}%
                        </p>
                        <p className="text-zinc-600 text-xs mt-1">Drafts converted</p>
                    </div>
                </div>
            </div>

            {/* Top Performing Articles */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-zinc-800 bg-zinc-900/30 flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4 text-zinc-500" />
                    <h2 className="text-base font-semibold text-zinc-100">Top Articles by Likes</h2>
                </div>
                {topArticles.length === 0 ? (
                    <div className="p-12 text-center text-zinc-600 text-sm">
                        No published articles yet. <Link href="/dashboard/writer/new" className="text-zinc-400 hover:underline">Write your first story</Link>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-wider">
                                <th className="p-3 pl-4 font-semibold">Article</th>
                                <th className="p-3 font-semibold w-20 text-center">Likes</th>
                                <th className="p-3 font-semibold w-20 text-center hidden sm:table-cell">Views</th>
                                <th className="p-3 pr-4 font-semibold w-28 text-right hidden md:table-cell">Published</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900">
                            {topArticles.map((article, i) => (
                                <tr key={article._id} className="hover:bg-zinc-900/30 transition-colors">
                                    <td className="p-3 pl-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-zinc-700 font-bold text-sm w-5 text-center">{i + 1}</span>
                                            <Link href={`/articles/${article._id}`} className="text-sm font-medium text-zinc-200 hover:underline line-clamp-1">
                                                {article.title}
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="p-3 text-center">
                                        <span className="text-sm font-bold text-zinc-300">{article.likes?.length || 0}</span>
                                    </td>
                                    <td className="p-3 text-center hidden sm:table-cell">
                                        <span className="text-sm text-zinc-500">{article.views || 0}</span>
                                    </td>
                                    <td className="p-3 pr-4 text-right hidden md:table-cell">
                                        <span className="text-xs text-zinc-600">{new Date(article.createdAt).toLocaleDateString()}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* All Articles Performance */}
            {articles.length > 0 && (
                <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-zinc-800 bg-zinc-900/30">
                        <h2 className="text-base font-semibold text-zinc-100">All Articles</h2>
                    </div>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-wider">
                                <th className="p-3 pl-4 font-semibold">Title</th>
                                <th className="p-3 font-semibold w-24">Status</th>
                                <th className="p-3 font-semibold w-20 text-center hidden sm:table-cell">Likes</th>
                                <th className="p-3 font-semibold w-20 text-center hidden md:table-cell">Views</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900">
                            {articles.map((article) => (
                                <tr key={article._id} className="hover:bg-zinc-900/30">
                                    <td className="p-3 pl-4">
                                        <Link href={`/articles/${article._id}`} className="text-sm font-medium text-zinc-300 hover:underline">{article.title}</Link>
                                    </td>
                                    <td className="p-3">
                                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${article.status === 'published' ? 'text-emerald-400 border-emerald-900 bg-emerald-950' : 'text-zinc-500 border-zinc-800'}`}>
                                            {article.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center hidden sm:table-cell text-sm text-zinc-500">{article.likes?.length || 0}</td>
                                    <td className="p-3 text-center hidden md:table-cell text-sm text-zinc-500">{article.views || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
