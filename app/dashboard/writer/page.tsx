"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Plus, Eye, ThumbsUp, FileText, Edit2, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WriterDashboard() {
    const { data: session } = useSession();
    const userName = session?.user?.name || (session?.user as any)?.email?.split("@")[0] || "Writer";
    const userId = (session?.user as any)?.id;
    const router = useRouter();

    const [articles, setArticles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const filterStatus = searchParams?.get('status');

    const fetchArticles = async () => {
        if (!userId) return;
        try {
            let url = `/api/articles?authorId=${userId}`;
            if (filterStatus) url += `&status=${filterStatus}`;

            const res = await fetch(url);
            const data = await res.json();
            if (res.ok) setArticles(data.articles || []);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (session) fetchArticles();
    }, [session, filterStatus]);

    const deleteArticle = async (id: string) => {
        if (!confirm("Delete this story?")) return;
        try {
            const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
            if (res.ok) fetchArticles();
        } catch (e) {
            console.error(e);
        }
    };

    const totalViews = articles.reduce((acc, curr) => acc + curr.views, 0);
    const totalLikes = articles.reduce((acc, curr) => acc + (curr.likes?.length || 0), 0);

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-900">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-100 mb-1">Welcome back, {userName}</h1>
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Total Views", value: totalViews, icon: Eye },
                    { label: "Total Artifacts", value: articles.length, icon: FileText },
                    { label: "Total Likes", value: totalLikes, icon: ThumbsUp }
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

            <div className="bg-zinc-950 border border-zinc-800 rounded-md overflow-hidden">
                <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/30">
                    <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2 capitalize">
                        <FileText className="w-4 h-4 text-zinc-500" />
                        {filterStatus ? `${filterStatus} Articles` : "All Stories"}
                    </h2>
                </div>

                <div className="overflow-x-auto min-h-[300px]">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-48">
                            <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-950 border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-wider">
                                    <th className="p-3 font-semibold pl-4">Title</th>
                                    <th className="p-3 font-semibold w-24">Status</th>
                                    <th className="p-3 font-semibold hidden sm:table-cell w-32">Date</th>
                                    <th className="p-3 font-semibold hidden md:table-cell w-20">Views</th>
                                    <th className="p-3 font-semibold hidden md:table-cell w-20">Likes</th>
                                    <th className="p-3 font-semibold text-right pr-4 w-24">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-900 text-sm">
                                {articles.map((article) => (
                                    <tr key={article._id} className="hover:bg-zinc-900/50 transition-colors group">
                                        <td className="p-3 pl-4">
                                            <Link
                                                href={article.status === 'draft' ? `/dashboard/writer/edit/${article._id}` : `/dashboard/reader/${article._id}`}
                                                className="font-semibold text-zinc-200 group-hover:underline"
                                            >
                                                {article.title}
                                            </Link>
                                        </td>
                                        <td className="p-3">
                                            <span className={`inline-block px-2 text-[10px] font-bold uppercase tracking-wider rounded-sm border ${article.status === 'published'
                                                ? 'bg-zinc-900 text-zinc-300 border-zinc-700'
                                                : 'bg-zinc-950 text-zinc-500 border-zinc-800'
                                                }`}>
                                                {article.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-zinc-500 hidden sm:table-cell">{new Date(article.createdAt).toLocaleDateString()}</td>
                                        <td className="p-3 text-zinc-500 hidden md:table-cell">{article.views}</td>
                                        <td className="p-3 text-zinc-500 hidden md:table-cell">{article.likes?.length || 0}</td>
                                        <td className="p-3 text-right pr-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/dashboard/writer/edit/${article._id}`}
                                                    className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </Link>
                                                <button onClick={() => deleteArticle(article._id)} className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors" title="Delete">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {articles.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center p-8 text-zinc-500 text-sm">No stories found. Create one.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
