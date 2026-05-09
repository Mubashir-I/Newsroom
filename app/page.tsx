import Link from "next/link";
import { ArrowRight, Newspaper, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col font-sans text-zinc-300">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-900 bg-zinc-950/80 sticky top-0 z-50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-zinc-100 rounded-[4px] flex items-center justify-center font-bold text-zinc-900 leading-none">
            N
          </div>
          <span className="font-bold text-lg tracking-tight text-zinc-100">Newsroom</span>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/login" className="text-zinc-400 hover:text-zinc-100 transition-colors">
            Sign In
          </Link>
        </div>
      </nav>

      <main className="flex flex-col items-center flex-1 px-6 pt-24 pb-32 max-w-5xl mx-auto w-full">
        <div className="flex flex-col items-center text-center max-w-3xl">
          <div className="px-3 py-1 rounded-[4px] border border-zinc-800 bg-zinc-900/50 mb-8 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-semibold text-zinc-300">Version 2.0 Live</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-zinc-100 tracking-tight mb-6 leading-[1.1]">
            Campus media,<br />
            built structured and fast.
          </h1>

          <p className="text-zinc-400 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            A clean, role-based platform empowering students and faculty to read, write, and manage stories that actually matter.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-sm">
            <Link
              href="/signup"
              className="flex flex-1 items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-semibold py-3 px-6 rounded-md transition-colors"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="flex flex-1 items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 font-semibold py-3 px-6 rounded-md transition-colors"
            >
              Access Portal
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-24">
          <div className="bg-zinc-950 p-6 rounded-lg border border-zinc-800/80">
            <Zap className="w-5 h-5 text-zinc-400 mb-4" />
            <h3 className="text-base font-semibold text-zinc-100 mb-2">Lightning Fast</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">Built on Next.js architectures ensuring your news feed loads instantly.</p>
          </div>

          <div className="bg-zinc-950 p-6 rounded-lg border border-zinc-800/80">
            <Shield className="w-5 h-5 text-zinc-400 mb-4" />
            <h3 className="text-base font-semibold text-zinc-100 mb-2">Role-Based Security</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">Distinct dashboards for Readers, Writers, and Admins via protected routes.</p>
          </div>

          <div className="bg-zinc-950 p-6 rounded-lg border border-zinc-800/80">
            <Newspaper className="w-5 h-5 text-zinc-400 mb-4" />
            <h3 className="text-base font-semibold text-zinc-100 mb-2">Rich Editing</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">A clean exact WYSIWYG editor for writers to craft stories with precision.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
