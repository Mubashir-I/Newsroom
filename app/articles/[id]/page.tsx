"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ThumbsUp, MessageSquare, Loader2, Send, LogIn, Clock } from "lucide-react";
import { useSession } from "next-auth/react";

// This page is PUBLIC — anyone can read, but must be signed in to interact
export default function PublicArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: session } = useSession();
    const [article, setArticle] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [notFound, setNotFound] = useState(false);

    // Fetch article and comments — no session dependency so it always loads
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [artRes, comRes] = await Promise.all([
                    fetch(`/api/articles/${id}`),
                    fetch(`/api/articles/${id}/comments`),
                ]);

                if (!artRes.ok) {
                    const errData = await artRes.json().catch(() => ({}));
                    console.error("Article fetch error:", artRes.status, errData);
                    setNotFound(true);
                    return;
                }

                const artData = await artRes.json();
                setArticle(artData);
                setLikeCount(artData.likes?.length || 0);

                if (comRes.ok) setComments(await comRes.json());
            } catch (err) {
                console.error("fetchData error:", err);
                setNotFound(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Update hasLiked whenever session or article changes
    useEffect(() => {
        if (session?.user && article?.likes) {
            const userId = (session.user as any).id;
            setHasLiked(article.likes.some((lid: any) => lid.toString() === userId));
        }
    }, [session, article]);

    const handleLike = async () => {
        if (!session) return;
        setIsLiking(true);
        try {
            const res = await fetch(`/api/articles/${id}/like`, { method: "POST" });
            if (res.ok) {
                const data = await res.json();
                setHasLiked(data.liked);
                setLikeCount(data.count);
            }
        } finally {
            setIsLiking(false);
        }
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session || !newComment.trim()) return;
        setIsSubmittingComment(true);
        try {
            const res = await fetch(`/api/articles/${id}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newComment }),
            });
            if (res.ok) {
                const comment = await res.json();
                // API now returns populated comment, use it directly
                setComments(prev => [comment, ...prev]);
                setNewComment("");
            }
        } finally {
            setIsSubmittingComment(false);
        }
    };

    if (isLoading) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
        </div>
    );

    if (notFound || !article) return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4 text-zinc-500 px-4 text-center">
            <p className="text-5xl">📰</p>
            <p className="text-xl font-bold text-zinc-300">Article not found</p>
            <p className="text-sm">This article may have been removed or isn&apos;t published yet.</p>
            <Link href="/" className="mt-2 px-4 py-2 bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-md text-sm font-semibold hover:bg-zinc-800 transition-colors">
                Back to Home
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans">
            {/* Top Nav */}
            <nav className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-900 px-6 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-zinc-100 rounded-[4px] flex items-center justify-center font-bold text-zinc-900 text-sm">N</div>
                    <span className="font-bold text-zinc-100">Newsroom</span>
                </Link>
                <div className="flex items-center gap-3">
                    {session ? (
                        <Link href="/dashboard" className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md text-sm font-semibold transition-colors">
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="text-zinc-400 hover:text-zinc-200 text-sm font-medium transition-colors">Sign In</Link>
                            <Link href="/signup" className="px-4 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-md text-sm font-semibold transition-colors">Join Free</Link>
                        </>
                    )}
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-4 py-12 pb-24">
                {/* Category + Meta */}
                <div className="flex items-center gap-3 mb-6">
                    <span className="px-2.5 py-1 border border-zinc-700 bg-zinc-900 text-zinc-300 text-[11px] font-bold uppercase tracking-widest rounded-sm">
                        {article.category}
                    </span>
                    <span className="text-zinc-600 text-xs flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-100 tracking-tight leading-[1.1] mb-6">
                    {article.title}
                </h1>

                {/* Author Row */}
                <div className="flex items-center gap-3 py-5 border-t border-b border-zinc-900 mb-8">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-zinc-300">
                        {article.author?.username?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-zinc-200">{article.author?.username || 'Unknown Author'}</p>
                        <p className="text-xs text-zinc-500">{Math.ceil((article.content?.length || 0) / 800)} min read</p>
                    </div>
                </div>

                {/* Cover Image */}
                {article.coverImage && (
                    <div className="w-full h-72 sm:h-96 relative rounded-lg overflow-hidden mb-10 bg-zinc-900">
                        <Image src={article.coverImage} alt={article.title} fill className="object-cover" priority />
                    </div>
                )}

                {/* Content */}
                <div className="text-zinc-300 text-lg leading-relaxed whitespace-pre-wrap mb-12 selection:bg-zinc-700">
                    {article.content}
                </div>

                {/* Tags */}
                {article.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-10 pb-10 border-b border-zinc-900">
                        {article.tags.map((tag: string) => (
                            <span key={tag} className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs rounded-full">{tag}</span>
                        ))}
                    </div>
                )}

                {/* Engagement Bar */}
                <div className="flex items-center gap-6 py-4 border-t border-b border-zinc-900 mb-12">
                    {session ? (
                        <button
                            onClick={handleLike}
                            disabled={isLiking}
                            className={`flex items-center gap-2 text-sm font-semibold transition-colors ${hasLiked ? 'text-blue-400' : 'text-zinc-500 hover:text-zinc-200'}`}
                        >
                            <ThumbsUp className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
                            <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
                        </button>
                    ) : (
                        <Link href="/login" className="flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-200 transition-colors">
                            <ThumbsUp className="w-5 h-5" />
                            <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
                        </Link>
                    )}
                    <div className="flex items-center gap-2 text-sm font-semibold text-zinc-500">
                        <MessageSquare className="w-5 h-5" />
                        <span>{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</span>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-zinc-100">Discussion ({comments.length})</h2>

                    {session ? (
                        <form onSubmit={handleComment} className="flex gap-3 items-start">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-300 text-sm shrink-0 mt-1">
                                {session.user?.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div className="flex-1 flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Share your thoughts..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmittingComment || !newComment.trim()}
                                    className="px-4 py-2 bg-zinc-100 text-zinc-900 rounded-lg text-sm font-bold hover:bg-zinc-200 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                                >
                                    {isSubmittingComment ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg flex items-center justify-between">
                            <p className="text-zinc-400 text-sm">Sign in to join the discussion</p>
                            <Link href="/login" className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 text-zinc-900 rounded-md text-xs font-bold hover:bg-zinc-200 transition-colors">
                                <LogIn className="w-3.5 h-3.5" />
                                Sign In
                            </Link>
                        </div>
                    )}

                    <div className="space-y-4">
                        {comments.map((comment) => (
                            <div key={comment._id} className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-400 text-xs shrink-0 mt-0.5">
                                    {comment.user?.username?.charAt(0)?.toUpperCase()}
                                </div>
                                <div className="flex-1 bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm font-bold text-zinc-200">{comment.user?.username}</span>
                                        <span className="text-[10px] text-zinc-600">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-zinc-400 text-sm leading-relaxed">{comment.content}</p>
                                </div>
                            </div>
                        ))}
                        {comments.length === 0 && (
                            <p className="text-zinc-600 text-sm italic py-4 text-center">No comments yet. Be the first to share your thoughts!</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
