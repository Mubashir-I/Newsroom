"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Share2, Bookmark, ThumbsUp, MessageSquare, Loader2, Send } from "lucide-react";
import { useSession } from "next-auth/react";

export default function ArticleReadPage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const { data: session } = useSession();
    const [article, setArticle] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [isLiking, setIsLiking] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await fetch(`/api/articles/${unwrappedParams.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setArticle(data);
                }

                const comRes = await fetch(`/api/articles/${unwrappedParams.id}/comments`);
                if (comRes.ok) {
                    const comData = await comRes.json();
                    setComments(comData);
                }
            } catch (err) {
                console.error("Failed to fetch article:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticle();
    }, [unwrappedParams.id]);

    const handleLike = async () => {
        if (!session) return alert("Login to like");
        setIsLiking(true);
        try {
            const res = await fetch(`/api/articles/${unwrappedParams.id}/like`, { method: "POST" });
            if (res.ok) {
                const data = await res.json();
                setArticle({ ...article, likes: data.liked 
                    ? [...(article.likes || []), (session.user as any).id] 
                    : (article.likes || []).filter((id: string) => id !== (session.user as any).id) 
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLiking(false);
        }
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) return alert("Login to comment");
        if (!newComment.trim()) return;

        try {
            const res = await fetch(`/api/articles/${unwrappedParams.id}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newComment }),
            });
            if (res.ok) {
                const comment = await res.json();
                setComments([{ ...comment, user: { username: session.user?.name || "Me" } }, ...comments]);
                setNewComment("");
            }
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

    if (!article) {
        return <div className="text-center p-12 text-zinc-500">Article not found</div>;
    }

    const hasLiked = article.likes?.includes((session?.user as any)?.id);

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <Link href="/dashboard/reader" className="text-zinc-500 hover:text-zinc-300 flex items-center gap-2 transition-colors w-fit text-sm font-medium pt-2">
                <ArrowLeft className="w-4 h-4" />
                Back to feed
            </Link>

            <article className="bg-zinc-950 border border-zinc-900 rounded-lg overflow-hidden mt-4">
                {/* Cover Image */}
                <div className="w-full h-[400px] relative bg-zinc-900 border-b border-zinc-900">
                    {article.coverImage ? (
                        <Image
                            src={article.coverImage}
                            alt="Article cover"
                            fill
                            className="object-cover opacity-90"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-700">No Cover Image</div>
                    )}
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
                            <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-zinc-300 text-lg">
                                {article.author?.username?.charAt(0) || 'A'}
                            </div>
                            <div>
                                <p className="text-base font-semibold text-zinc-200">{article.author?.username || 'Unknown'}</p>
                                <p className="text-xs text-zinc-500">{new Date(article.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="p-2 border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 rounded-md transition-colors text-zinc-400 hover:text-zinc-200" title="Share">
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Article Body */}
                <div className="p-8 md:p-12 prose prose-zinc prose-invert max-w-none text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {article.content}
                </div>

                {/* Footer Actions */}
                <div className="px-8 md:px-12 py-6 border-t border-zinc-900 flex items-center gap-6 bg-zinc-950 text-sm">
                    <button 
                        onClick={handleLike}
                        disabled={isLiking}
                        className={`flex items-center gap-2 transition-colors font-medium ${hasLiked ? 'text-blue-500' : 'text-zinc-400 hover:text-zinc-200'}`}
                    >
                        <ThumbsUp className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
                        <span>{article.likes?.length || 0} Likes</span>
                    </button>
                    <div className="flex items-center gap-2 text-zinc-400 font-medium">
                        <MessageSquare className="w-5 h-5" />
                        <span>{comments.length} Comments</span>
                    </div>
                </div>
            </article>

            {/* Comments Section */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-zinc-100">Discussion</h3>
                
                {session ? (
                    <form onSubmit={handleComment} className="flex gap-4">
                        <input 
                            type="text" 
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-md px-4 py-2 text-zinc-300 focus:outline-none focus:border-zinc-500"
                        />
                        <button type="submit" className="bg-zinc-100 text-zinc-900 px-4 py-2 rounded-md font-bold hover:bg-zinc-200 transition-colors">
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                ) : (
                    <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-md text-zinc-500 text-sm">
                        Please <Link href="/login" className="text-zinc-300 hover:underline">login</Link> to join the discussion.
                    </div>
                )}

                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment._id} className="p-4 bg-zinc-950 border border-zinc-900 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-bold text-zinc-200">{comment.user?.username}</span>
                                <span className="text-[10px] text-zinc-600">{new Date(comment.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-zinc-400 text-sm">{comment.content}</p>
                        </div>
                    ))}
                    {comments.length === 0 && (
                        <p className="text-zinc-600 text-sm italic">No comments yet. Be the first to share your thoughts!</p>
                    )}
                </div>
            </div>
        </div>
    );
}
