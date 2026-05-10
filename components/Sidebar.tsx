"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  PenTool,
  Bookmark,
  TrendingUp,
  LogOut,
  Newspaper,
  Activity
} from "lucide-react";
import { signOut } from "next-auth/react";

export function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = (session?.user as any)?.role || "reader";

  const getLinks = () => {
    switch (role) {
      case "admin":
        return [
          { name: "Overview & Users", href: "/dashboard/admin", icon: LayoutDashboard },
          { name: "Article Management", href: "/dashboard/admin#articles", icon: Activity },
        ];
      case "writer":
        return [
          { name: "Writer Overview", href: "/dashboard/writer", icon: LayoutDashboard },
          { name: "Write New", href: "/dashboard/writer/new", icon: PenTool },
          { name: "My Drafts", href: "/dashboard/writer?status=draft", icon: FileText },
          { name: "Published", href: "/dashboard/writer?status=published", icon: Newspaper },
        ];
      case "reader":
      default:
        return [
          { name: "Latest News", href: "/dashboard/reader", icon: Newspaper },
        ];
    }
  };

  const links = getLinks();

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-900 hidden md:flex flex-col h-screen sticky top-0 shrink-0">
      <div className="p-6 border-b border-zinc-900 flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-zinc-100 rounded-[4px] flex items-center justify-center font-bold text-zinc-900 leading-none">
            N
          </div>
          <span className="font-bold text-lg tracking-tight text-zinc-100">Newsroom</span>
        </Link>
      </div>

      <div className="flex-1 py-6 px-4 space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-3 px-3">Menu</p>
        {links.map((link) => {
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== `/dashboard/${role}`);
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${isActive
                ? "bg-zinc-900 text-zinc-100"
                : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"
                }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-zinc-100" : "text-zinc-500"}`} />
              <span className="font-semibold">{link.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-zinc-900">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-zinc-400 hover:bg-zinc-900 hover:text-red-400 transition-colors text-sm"
        >
          <LogOut className="w-4 h-4 text-zinc-500" />
          <span className="font-semibold">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
