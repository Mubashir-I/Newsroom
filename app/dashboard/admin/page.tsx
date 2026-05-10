"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Users, Search, Edit, Trash2, UserPlus, Server, Activity, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [articles, setArticles] = useState<any[]>([]);
    const [isArticlesLoading, setIsArticlesLoading] = useState(true);
    const [searchArticleTerm, setSearchArticleTerm] = useState("");

    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredArticles = articles.filter(a =>
        a.title.toLowerCase().includes(searchArticleTerm.toLowerCase()) ||
        a.category.toLowerCase().includes(searchArticleTerm.toLowerCase())
    );

    // Fetch users from DB
    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users");
            const data = await res.json();
            if (res.ok) setUsers(data.users || []);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchArticles = async () => {
        try {
            const res = await fetch("/api/articles");
            const data = await res.json();
            if (res.ok) setArticles(data.articles || []);
        } catch (e) {
            console.error(e);
        } finally {
            setIsArticlesLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchArticles();
    }, []);

    const changeRole = async (id: string, newRole: string) => {
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole })
            });
            if (res.ok) fetchUsers();
        } catch (e) {
            console.error("Failed to update role");
        }
    };

    const changeStatus = async (id: string, isActive: boolean) => {
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive })
            });
            if (res.ok) fetchUsers();
        } catch (e) {
            console.error("Failed to update status");
        }
    };

    const deleteUser = async (id: string) => {
        if (!confirm("Are you sure you want to permanently delete this user?")) return;
        try {
            const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
            if (res.ok) fetchUsers();
            else alert("Failed to delete user. Cannot delete yourself.");
        } catch (e) {
            console.error(e);
        }
    };

    const deleteArticle = async (id: string) => {
        if (!confirm("Are you sure you want to delete this article?")) return;
        try {
            const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
            if (res.ok) fetchArticles();
            else alert("Failed to delete article");
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="pb-6 border-b border-zinc-900 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-100 mb-1">System Overview</h1>
                    <p className="text-zinc-500 text-sm">Monitor system health and access control.</p>
                </div>
                <button onClick={() => { fetchUsers(); fetchArticles(); }} className="flex items-center gap-2 text-xs font-semibold bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-md transition-colors">
                    <Server className="w-3.5 h-3.5" /> Refresh Data
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Users", value: users.length, change: "+12%" },
                    { label: "Active Sessions", value: "342", change: "+5%" },
                    { label: "Storage", value: "48.2 GB", change: "+2%" },
                    { label: "Load", value: "24%", change: "-3%" }
                ].map((stat) => (
                    <div key={stat.label} className="bg-zinc-950 border border-zinc-800 p-4 rounded-md">
                        <h3 className="text-2xl font-bold text-zinc-100 mb-1 leading-none">{stat.value}</h3>
                        <div className="flex items-center gap-2">
                            <p className="text-zinc-500 text-xs font-semibold uppercase">{stat.label}</p>
                            <span className={`text-[10px] font-bold ${stat.change.startsWith('+') ? 'text-zinc-400' : 'text-zinc-600'}`}>{stat.change}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-md overflow-hidden">
                <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/30">
                    <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                        <Users className="w-4 h-4 text-zinc-500" />
                        User Management
                    </h2>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-zinc-950 border border-zinc-800 text-xs rounded-md pl-8 pr-3 py-1.5 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 w-full sm:w-48"
                            />
                        </div>
                        <button className="p-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-md transition-colors" title="Add User">
                            <UserPlus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[300px]">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-48">
                            <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="bg-zinc-950 border-b border-zinc-800 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                                    <th className="p-3 pl-4">User</th>
                                    <th className="p-3">Role</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Joined</th>
                                    <th className="p-3 text-right pr-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-900 text-sm">
                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-zinc-900/50 transition-colors">
                                        <td className="p-3 pl-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-zinc-400 text-xs shadow-sm">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-zinc-200 text-sm">{user.username}</p>
                                                    <p className="text-xs text-zinc-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <select
                                                value={user.role}
                                                onChange={(e) => changeRole(user._id, e.target.value)}
                                                className="bg-zinc-900 text-xs font-medium text-zinc-400 uppercase tracking-wider border border-zinc-800 rounded p-1 focus:outline-none"
                                            >
                                                <option value="reader">READER</option>
                                                <option value="writer">WRITER</option>
                                                <option value="admin">ADMIN</option>
                                            </select>
                                        </td>
                                        <td className="p-3">
                                            <button
                                                onClick={() => changeStatus(user._id, user.isActive === false ? true : false)}
                                                className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border transition-colors ${user.isActive !== false
                                                    ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900 hover:bg-emerald-900/50'
                                                    : 'bg-red-950/30 text-red-400 border-red-900 hover:bg-red-900/50'
                                                    }`}
                                            >
                                                {user.isActive !== false ? 'Active' : 'Suspended'}
                                            </button>
                                        </td>
                                        <td className="p-3 text-sm text-zinc-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-3 pr-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => deleteUser(user._id)} className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors" title="Delete">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center p-8 text-zinc-500 text-sm">No users found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* ARTice MANAGEMENT SECtiON */}
            <div id="articles" className="bg-zinc-950 border border-zinc-800 rounded-md overflow-hidden mt-8 scroll-mt-6">
                <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/30">
                    <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-zinc-500" />
                        Article Management & Moderation
                    </h2>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2" />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchArticleTerm}
                                onChange={(e) => setSearchArticleTerm(e.target.value)}
                                className="bg-zinc-950 border border-zinc-800 text-xs rounded-md pl-8 pr-3 py-1.5 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 w-full sm:w-48"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[300px]">
                    {isArticlesLoading ? (
                        <div className="flex items-center justify-center h-48">
                            <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="bg-zinc-950 border-b border-zinc-800 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                                    <th className="p-3 pl-4">Title</th>
                                    <th className="p-3">Author</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Published On</th>
                                    <th className="p-3 text-right pr-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-900 text-sm">
                                {filteredArticles.map((article) => (
                                    <tr key={article._id} className="hover:bg-zinc-900/50 transition-colors">
                                        <td className="p-3 pl-4">
                                            <Link href={`/articles/${article._id}`} className="group flex items-center gap-1.5 focus:outline-none">
                                                <p className="font-semibold text-zinc-200 text-sm line-clamp-1 max-w-[250px] group-hover:text-blue-400 transition-colors">{article.title}</p>
                                                <ExternalLink className="w-3 h-3 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Link>
                                            <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">{article.category}</p>
                                        </td>
                                        <td className="p-3 font-medium text-zinc-300">
                                            {article.author?.username || "Unknown"}
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${article.status === 'published' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900' : 'bg-amber-950/30 text-amber-400 border-amber-900'}`}>
                                                {article.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-sm text-zinc-500">
                                            {new Date(article.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-3 pr-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => deleteArticle(article._id)} className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors" title="Delete">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {articles.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center p-8 text-zinc-500 text-sm">No articles found in DB.</td>
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
