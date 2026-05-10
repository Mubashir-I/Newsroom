"use client";

import Link from "next/link";
import { ArrowRight, Newspaper, Shield, Zap, Loader2, Clock, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Footer } from "@/components/Footer";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop";

export default function Home() {
  const { data: session } = useSession();
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch('/api/articles?status=published');
        if (res.ok) {
          const data = await res.json();
          setArticles(data.articles || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col font-sans text-zinc-300">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-900 bg-zinc-950/80 sticky top-0 z-50 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-zinc-100 rounded-[4px] flex items-center justify-center font-bold text-zinc-900 leading-none text-sm">N</div>
          <span className="font-bold text-lg tracking-tight text-zinc-100">Newsroom</span>
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          {session ? (
            <Link href="/dashboard" className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md font-semibold transition-colors">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-zinc-400 hover:text-zinc-100 transition-colors">Sign In</Link>
              <Link href="/signup" className="px-4 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-md font-semibold transition-colors">
                Join Free
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-12 space-y-16">

        {/* Hero */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 mb-6 flex items-center gap-2 text-xs font-semibold text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Live & Updated
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-zinc-100 tracking-tight leading-[1.08] mb-5">
            Campus media,<br />structured and fast.
          </h1>
          <p className="text-zinc-400 text-base md:text-lg max-w-xl leading-relaxed mb-8">
            A modern newsroom platform for students and faculty — read, write, and engage with stories that matter.
          </p>
          {!session && (
            <div className="flex gap-3">
              <Link href="/signup" className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-semibold py-2.5 px-5 rounded-md transition-colors text-sm">
                Start Reading <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/login" className="flex items-center bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 font-semibold py-2.5 px-5 rounded-md transition-colors text-sm">
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* News Feed */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-zinc-500" />
              Latest Stories
            </h2>
            {articles.length > 0 && (
              <span className="text-xs text-zinc-600">{articles.length} articles published</span>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
            </div>
          ) : articles.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-zinc-800 rounded-lg">
              <Newspaper className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500">No stories published yet.</p>
              <Link href="/signup?role=writer" className="text-sm text-zinc-300 hover:underline mt-2 inline-block">
                Become a writer →
              </Link>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Top 5 Dynamic Featured Layout (Z-Pattern) */}
              <div className="space-y-10">
                {articles.slice(0, 5).map((article, index) => {
                  const isEven = index % 2 === 0;
                  return (
                    <Link key={article._id} href={`/articles/${article._id}`} className="group block">
                      <div className={`grid md:grid-cols-2 gap-0 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-all duration-500 bg-zinc-950/50 shadow-xl ${index === 0 ? 'min-h-[450px]' : 'min-h-[350px]'}`}>
                        <div className={`h-64 md:h-auto relative bg-zinc-900 overflow-hidden ${!isEven && 'md:order-last'}`}>
                          <img
                            src={article.coverImage || FALLBACK_IMAGE}
                            alt={article.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            loading="lazy"
                            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                        </div>
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                          <div className="flex items-center gap-3 mb-6">
                            <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded-full">
                              {article.category}
                            </span>
                            <span className="text-zinc-600 text-xs flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <h2 className={`${index === 0 ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl'} font-bold text-zinc-100 leading-[1.1] mb-5 group-hover:text-white transition-colors duration-300`}>
                            {article.title}
                          </h2>
                          <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-8 line-clamp-3 md:line-clamp-4">
                            {article.content?.replace(/<[^>]*>/g, '').substring(0, 250)}...
                          </p>
                          <div className="flex items-center gap-3 mt-auto">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-200">
                              {article.author?.username?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-zinc-300 leading-none mb-1">{article.author?.username}</p>
                              <p className="text-[10px] text-zinc-600 uppercase tracking-tighter">Verified Publication</p>
                            </div>
                            <div className="ml-auto flex items-center gap-4">
                              <span className="text-xs text-zinc-500 flex items-center gap-1"><Zap className="w-3 h-3" /> {article.likes?.length || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Grid for ALL remaining articles */}
              <div className="pt-12 border-t border-zinc-900">
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-[0.2em] mb-10 text-center">More from the Newsroom</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {articles.slice(5).map((article) => (
                    <Link key={article._id} href={`/articles/${article._id}`} className="group block bg-zinc-950/30 border border-zinc-900 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-300 flex flex-col">
                      <div className="h-56 relative bg-zinc-900 overflow-hidden">
                        <img
                          src={article.coverImage || FALLBACK_IMAGE}
                          alt={article.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{article.category}</span>
                          <span className="text-zinc-800">|</span>
                          <span className="text-[10px] text-zinc-600">{new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                        <h3 className="text-lg font-bold text-zinc-200 mb-3 leading-tight line-clamp-2 group-hover:text-white transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2 mb-6">
                          {article.content?.replace(/<[^>]*>/g, '').substring(0, 150)}...
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-900/50">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                              {article.author?.username?.charAt(0)?.toUpperCase()}
                            </div>
                            <span className="text-xs font-semibold text-zinc-500">{article.author?.username}</span>
                          </div>
                          <span className="text-[10px] text-zinc-700 font-bold uppercase">{article.likes?.length || 0} Likes</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-zinc-900">
          {[
            { icon: Zap, title: "Lightning Fast", desc: "Built on Next.js App Router for instant page loads and real-time updates." },
            { icon: Shield, title: "Role-Based Access", desc: "Separate dashboards for Readers, Writers, and Admins with protected routes." },
            { icon: Newspaper, title: "Rich Content", desc: "Writers get a full editor with image upload, drafts, and publish controls." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-zinc-950 p-6 rounded-lg border border-zinc-800/80 hover:border-zinc-700 transition-colors">
              <Icon className="w-5 h-5 text-zinc-400 mb-4" />
              <h3 className="text-base font-semibold text-zinc-100 mb-2">{title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
