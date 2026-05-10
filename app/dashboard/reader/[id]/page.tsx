"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Share2, Bookmark, ThumbsUp, MessageSquare, Loader2 } from "lucide-react";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop";

export default function ArticleReadPage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await fetch(`/api/articles/${unwrappedParams.id}`);
                const data = await res.json();
                if (res.ok) setArticle(data.article);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [unwrappedParams.id]);

    useEffect(() => {
        // Fix broken inline images after they render
        const fixImages = () => {
            const content = document.getElementById('dashboard-article-content');
            if (!content) return;
            const imgs = content.getElementsByTagName('img');
            for (let i = 0; i < imgs.length; i++) {
                imgs[i].onerror = () => {
                    imgs[i].src = FALLBACK_IMAGE;
                };
                if (imgs[i].naturalWidth === 0 && imgs[i].complete) {
                    imgs[i].src = FALLBACK_IMAGE;
                }
            }
        };
        if (!loading && article) {
            setTimeout(fixImages, 100);
        }
    }, [loading, article]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-32">
                <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
            </div>
        );
    }

    if (!article) {
        return (
            <div className="max-w-4xl mx-auto p-12 text-center border border-zinc-900 bg-zinc-950 mt-10 rounded-md">
                <h1 className="text-xl font-bold text-zinc-300">Article not found</h1>
                <Link href="/dashboard/reader" className="text-zinc-500 hover:text-zinc-300 mt-4 inline-block">Return to feed</Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <Link href="/dashboard/reader" className="text-zinc-500 hover:text-zinc-300 flex items-center gap-2 transition-colors w-fit text-sm font-medium pt-2">
                <ArrowLeft className="w-4 h-4" />
                Back to feed
            </Link>

            <article className="bg-zinc-950 border border-zinc-900 rounded-lg overflow-hidden mt-4">
                {/* Cover Image */}
                <div className="w-full h-[300px] md:h-[400px] relative bg-zinc-900 border-b border-zinc-900 overflow-hidden">
                    <img
                        src={article.coverImage || FALLBACK_IMAGE}
                        alt="Cover"
                        className="w-full h-full object-cover opacity-90"
                        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                    />
                </div>

                {/* Article Header */}
                <div className="p-8 md:p-12 pb-6 border-b border-zinc-900">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-2 py-0.5 border border-zinc-700 bg-zinc-900 text-zinc-300 text-[10px] font-bold uppercase tracking-wider rounded-sm">
                            {article.category}
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold text-zinc-100 tracking-tight leading-[1.1] mb-6">
                        {article.title}
                    </h1>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-zinc-900">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-zinc-300 text-lg uppercase shadow-sm">
                                {article.author?.username?.charAt(0) || "W"}
                            </div>
                            <div>
                                <p className="text-base font-semibold text-zinc-200">{article.author?.username}</p>
                                <p className="text-xs text-zinc-500">{new Date(article.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="p-2 border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 rounded-md transition-colors text-zinc-400 hover:text-zinc-200" title="Share">
                                <Share2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 rounded-md transition-colors text-zinc-400 hover:text-zinc-200" title="Save">
                                <Bookmark className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Article Body */}
                <div className="p-8 md:p-12 prose prose-zinc prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-a:text-zinc-300 prose-blockquote:border-zinc-700 prose-blockquote:bg-zinc-900/50 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-md">
                    <div id="dashboard-article-content" dangerouslySetInnerHTML={{ __html: article.content }} />
                </div>

                {/* Footer Actions */}
                <div className="px-8 md:px-12 py-6 border-t border-zinc-900 flex items-center gap-6 bg-zinc-950 text-sm">
                    <button className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors font-medium">
                        <ThumbsUp className="w-5 h-5" />
                        <span>{article.likes?.length || 0} Likes</span>
                    </button>
                    <button className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors font-medium">
                        <MessageSquare className="w-5 h-5" />
                        <span>{article.comments || 0} Comments</span>
                    </button>
                </div>
            </article>

            {/* Author Bio Box */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-6 flex flex-col sm:flex-row gap-6 mt-8">
                <div className="w-16 h-16 rounded-md bg-zinc-900 border border-zinc-800 shrink-0 flex items-center justify-center font-bold text-zinc-300 text-2xl uppercase shadow-sm">
                    {article.author?.username?.charAt(0) || "W"}
                </div>
                <div>
                    <h3 className="text-zinc-100 font-bold mb-2 uppercase tracking-wide text-xs">About the Author</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        Writer covering breaking events and comprehensive analyses for Newsroom. Contact them via {article.author?.email || "their profile"}.
                    </p>
                </div>
            </div>
        </div>
    );
}
