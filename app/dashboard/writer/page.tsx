"use client";

import { useSession } from "next-auth/react";
import { Plus, Eye, ThumbsUp, FileText, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";

const WRITER_STATS = [
    { label: "Total Views", value: "14.2K", icon: Eye },
    { label: "Published Artifacts", value: "24", icon: FileText },
    { label: "Total Likes", value: "3.4K", icon: ThumbsUp }
];

const WRITER_ARTICLES = [
    { id: 1, title: "10 Frameworks to Watch in 2026", status: "Published", date: "Oct 12, 2026", views: 1204, likes: 342 },
    { id: 2, title: "Understanding React 19 Compiler", status: "Draft", date: "Oct 10, 2026", views: 0, likes: 0 },
    { id: 3, title: "Why CSS Subgrid will change Layouts", status: "Published", date: "Sep 28, 2026", views: 4209, likes: 890 },
    { id: 4, title: "The End of Traditional REST APIs?", status: "Published", date: "Sep 15, 2026", views: 8800, likes: 1102 }
];

export default function WriterDashboard() {
    const { data: session } = useSession();
    const userName = session?.user?.name || (session?.user as any)?.email?.split("@")[0] || "Writer";

    return (
        <div className="space-y-8 pb-12">

            {/* Header & Actions */}
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

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {WRITER_STATS.map((stat) => (
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
                    <div className="flex rounded-md border border-zinc-800 overflow-hidden bg-zinc-950 text-xs font-medium">
                        <button className="px-3 py-1 bg-zinc-800 text-zinc-100">All</button>
                        <button className="px-3 py-1 text-zinc-400 hover:bg-zinc-900 transition-colors">Published</button>
                        <button className="px-3 py-1 text-zinc-400 hover:bg-zinc-900 transition-colors border-l border-zinc-800">Drafts</button>
                    </div>
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
                                <th className="p-3 font-semibold text-right pr-4 w-24">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900 text-sm">
                            {WRITER_ARTICLES.map((article) => (
                                <tr key={article.id} className="hover:bg-zinc-900/50 transition-colors group">
                                    <td className="p-3 pl-4">
                                        <p className="font-semibold text-zinc-200 group-hover:underline cursor-pointer">{article.title}</p>
                                    </td>
                                    <td className="p-3">
                                        <span className={`inline-block px-2 text-[10px] font-bold uppercase tracking-wider rounded-sm border ${article.status === 'Published'
                                                ? 'bg-zinc-900 text-zinc-300 border-zinc-700'
                                                : 'bg-zinc-950 text-zinc-500 border-zinc-800'
                                            }`}>
                                            {article.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-zinc-500 hidden sm:table-cell">{article.date}</td>
                                    <td className="p-3 text-zinc-500 hidden md:table-cell">{article.views.toLocaleString()}</td>
                                    <td className="p-3 text-zinc-500 hidden md:table-cell">{article.likes.toLocaleString()}</td>
                                    <td className="p-3 text-right pr-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors" title="Edit">
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors" title="Delete">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
