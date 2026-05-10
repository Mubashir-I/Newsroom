"use client";

import { useSession } from "next-auth/react";
import { Plus, Eye, ThumbsUp, FileText, Edit2, Trash2, Loader2, Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function WriterDashboard() {
    const { data: session } = useSession();
    const [articles, setArticles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({ views: 0, published: 0, likes: 0 });

    const fetchArticles = async () => {
        if (!session?.user) return;
        try {
            const res = await fetch(`/api/articles?author=${(session.user as any).id}&status=all`);
            if (res.ok) {
                const data = await res.json();
                setArticles(data);
                
                // Calculate stats
                const totalViews = data.reduce((acc: number, art: any) => acc + (art.views || 0), 0);
                const totalLikes = data.reduce((acc: number, art: any) => acc + (art.likes?.length || 0), 0);
                const publishedCount = data.filter((art: any) => art.status === 'published').length;
                
                setStats({
                    views: totalViews,
                    published: publishedCount,
                    likes: totalLikes
                });
            }
        } catch (err) {
            console.error("Failed to fetch articles:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, [session]);

    const handlePublish = async (id: string) => {
        if (!confirm("Are you sure you want to publish this article?")) return;
        try {
            const res = await fetch(`/api/articles/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: 'published' }),
            });
            if (res.ok) fetchArticles();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this article? This action cannot be undone.")) return;
        try {
            const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
            if (res.ok) fetchArticles();
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">

            {/* Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-900">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-100 mb-1">Welcome back, {session?.user?.name}</h1>
                    <p className="text-zinc-500 text-sm">Manage your stories and audience engagement.</p>
                </div>
                <Link
                    href="/dashboard/writer/new"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-sm font-semibold rounded-md transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Write New Article
                </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Total Views", value: stats.views.toLocaleString(), icon: Eye },
                    { label: "Published Stories", value: stats.published, icon: FileText },
                    { label: "Total Likes", value: stats.likes.toLocaleString(), icon: ThumbsUp }
                ].map((stat) => (
                    <div key={stat.label} className="bg-zinc-950 border border-zinc-800 p-4 rounded-md flex items-center justify-between">
                        <div>
                            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-zinc-100">{stat.value}</h3>
                        </div>
                        <stat.icon className="w-5 h-5 text-zinc-700" />
                    </div>
                ))}
            </div>

            {/* Content Management */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-md overflow-hidden">
                <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/30">
                    <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-zinc-500" />
                        Your Stories
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-950 border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-wider">
                                <th className="p-3 font-semibold pl-4">Title</th>
                                <th className="p-3 font-semibold w-24">Status</th>
                                <th className="p-3 font-semibold hidden sm:table-cell w-32">Date</th>
                                <th className="p-3 font-semibold hidden md:table-cell w-20">Views</th>
                                <th className="p-3 font-semibold hidden md:table-cell w-20">Likes</th>
                                <th className="p-3 font-semibold text-right pr-4 w-40">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900 text-sm">
                            {articles.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-zinc-600">
                                        No articles found. Start writing today!
                                    </td>
                                </tr>
                            ) : (
                                articles.map((article) => (
                                    <tr key={article._id} className="hover:bg-zinc-900/50 transition-colors group">
                                        <td className="p-3 pl-4">
                                            <p className="font-semibold text-zinc-200 group-hover:underline cursor-pointer">{article.title}</p>
                                        </td>
                                        <td className="p-3">
                                            <span className={`inline-block px-2 text-[10px] font-bold uppercase tracking-wider rounded-sm border ${article.status === 'published'
                                                    ? 'bg-zinc-900 text-zinc-300 border-zinc-700'
                                                    : 'bg-zinc-950 text-zinc-500 border-zinc-800'
                                                }`}>
                                                {article.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-zinc-500 hidden sm:table-cell">
                                            {new Date(article.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-3 text-zinc-500 hidden md:table-cell">{article.views?.toLocaleString()}</td>
                                        <td className="p-3 text-zinc-500 hidden md:table-cell">{article.likes?.length || 0}</td>
                                        <td className="p-3 text-right pr-4">
                                            <div className="flex items-center justify-end gap-1">
                                                {article.status === 'draft' && (
                                                    <button 
                                                        onClick={() => handlePublish(article._id)}
                                                        className="p-1.5 text-emerald-500 hover:text-emerald-400 hover:bg-zinc-800 rounded transition-colors" title="Publish Now">
                                                        <Send className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                                <Link href={`/dashboard/writer/edit/${article._id}`} className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors" title="Edit">
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(article._id)}
                                                    className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors" title="Delete">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
