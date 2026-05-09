"use client";

import { useSession } from "next-auth/react";
import { Users, Server, Database, Activity, Search, Edit, Trash2, UserPlus } from "lucide-react";

const SYSTEM_STATS = [
    { label: "Total Users", value: "1,248", change: "+12%" },
    { label: "Active Sessions", value: "342", change: "+5%" },
    { label: "Storage", value: "48.2 GB", change: "+2%" },
    { label: "Load", value: "24%", change: "-3%" }
];

const DUMMY_USERS = [
    { id: 1, name: "Alice Freeman", email: "alice@example.com", role: "admin", status: "Active", lastLogin: "2 mins ago" },
    { id: 2, name: "John Doe", email: "john@example.com", role: "writer", status: "Active", lastLogin: "1 hour ago" },
    { id: 3, name: "Charlie Smith", email: "charlie@example.com", role: "reader", status: "Offline", lastLogin: "2 days ago" },
    { id: 4, name: "Diana Prince", email: "diana@example.com", role: "writer", status: "Suspended", lastLogin: "1 week ago" },
    { id: 5, name: "Evan Wright", email: "evan@example.com", role: "reader", status: "Active", lastLogin: "5 mins ago" },
];

export default function AdminDashboard() {
    const { data: session } = useSession();

    return (
        <div className="space-y-8 pb-12">

            {/* Header Area */}
            <div className="pb-6 border-b border-zinc-900">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-100 mb-1">System Overview</h1>
                <p className="text-zinc-500 text-sm">Monitor system health and access control.</p>
            </div>

            {/* System Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {SYSTEM_STATS.map((stat) => (
                    <div key={stat.label} className="bg-zinc-950 border border-zinc-800 p-4 rounded-md">
                        <h3 className="text-2xl font-bold text-zinc-100 mb-1 leading-none">{stat.value}</h3>
                        <div className="flex items-center gap-2">
                            <p className="text-zinc-500 text-xs font-semibold uppercase">{stat.label}</p>
                            <span className={`text-[10px] font-bold ${stat.change.startsWith('+') ? 'text-zinc-400' : 'text-zinc-600'}`}>{stat.change}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* User Management Section */}
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
                                placeholder="Search..."
                                className="bg-zinc-950 border border-zinc-800 text-xs rounded-md pl-8 pr-3 py-1.5 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 w-full sm:w-48"
                            />
                        </div>
                        <button className="p-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-md transition-colors" title="Add User">
                            <UserPlus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-zinc-950 border-b border-zinc-800 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                                <th className="p-3 pl-4">User</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Last Login</th>
                                <th className="p-3 text-right pr-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900 text-sm">
                            {DUMMY_USERS.map((user) => (
                                <tr key={user.id} className="hover:bg-zinc-900/50 transition-colors">
                                    <td className="p-3 pl-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-zinc-400 text-xs shadow-sm">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-zinc-200 text-sm">{user.name}</p>
                                                <p className="text-xs text-zinc-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{user.role}</span>
                                    </td>
                                    <td className="p-3">
                                        <span className={`text-xs font-semibold ${user.status === 'Active' ? 'text-zinc-300' : 'text-zinc-600'}`}>{user.status}</span>
                                    </td>
                                    <td className="p-3 text-sm text-zinc-500">
                                        {user.lastLogin}
                                    </td>
                                    <td className="p-3 pr-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors" title="Edit">
                                                <Edit className="w-3.5 h-3.5" />
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
