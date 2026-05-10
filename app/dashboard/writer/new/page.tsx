"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { ArrowLeft, Save, Send, Image as ImageIcon, Link as LinkIcon, Bold, Italic, List, Hash, Loader2, Type } from "lucide-react";

export default function WriterNewArticle() {
    const router = useRouter();
    const contentRef = useRef<HTMLTextAreaElement>(null);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const insertTag = (tag: string, type: 'wrap' | 'block' | 'h2' | 'img' = 'wrap') => {
        const textarea = contentRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = content.substring(start, end);
        let replacement = "";

        if (type === 'wrap') {
            if (tag === 'a') {
                const url = prompt("Enter URL:", "https://");
                if (!url) return;
                replacement = `<a href="${url}">${selected || 'link text'}</a>`;
            } else {
                replacement = `<${tag}>${selected || tag}</${tag}>`;
            }
        } else if (type === 'img') {
            const url = prompt("Enter Image URL:", "https://images.unsplash.com/...");
            if (!url) return;
            replacement = `\n<img src="${url}" style="width:100%; border-radius:8px; margin:2rem 0;" />\n`;
        } else if (type === 'h2') {
            replacement = `\n<h2>${selected || 'Subheading'}</h2>\n`;
        }

        const newContent = content.substring(0, start) + replacement + content.substring(end);
        setContent(newContent);

        // Refocus and set selection after a tick
        setTimeout(() => {
            textarea.focus();
            const newPos = start + replacement.length;
            textarea.setSelectionRange(newPos, newPos);
        }, 10);
    };

    const saveArticle = async (status: "draft" | "published") => {
        if (!title || !content || !category) {
            alert("Title, Content, and Category are required.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/articles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    content,
                    category,
                    coverImage,
                    status
                })
            });

            if (res.ok) {
                router.push("/dashboard/writer");
            } else {
                const data = await res.json();
                alert(data.message || "Failed to save");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-full flex flex-col pb-12">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-zinc-900">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-zinc-500 hover:text-zinc-200 transition-colors text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Stories
                </button>

                <div className="flex items-center gap-3">
                    <button
                        disabled={isSubmitting}
                        onClick={() => saveArticle("draft")}
                        className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-sm font-semibold rounded-md transition-colors disabled:opacity-50"
                    >
                        <Save className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Save Draft</span>
                    </button>
                    <button
                        disabled={isSubmitting}
                        onClick={() => saveArticle("published")}
                        className="flex items-center gap-2 px-4 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-sm font-bold rounded-md transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                        <span>Publish</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-md flex flex-col">
                <div className="h-12 bg-zinc-900/50 border-b border-zinc-800 flex items-center px-4 gap-1">
                    <button
                        onClick={() => insertTag('h2', 'h2')}
                        className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold text-zinc-300 uppercase hover:bg-zinc-800 rounded transition-colors"
                    >
                        <Type className="w-3.5 h-3.5" />
                        Subheading
                    </button>
                    <div className="w-px h-4 bg-zinc-800 mx-1"></div>
                    <button onClick={() => insertTag('b')} className="p-1.5 text-zinc-400 hover:text-zinc-100 transition-colors" title="Bold"><Bold className="w-4 h-4" /></button>
                    <button onClick={() => insertTag('i')} className="p-1.5 text-zinc-400 hover:text-zinc-100 transition-colors" title="Italic"><Italic className="w-4 h-4" /></button>
                    <div className="w-px h-4 bg-zinc-800 mx-1"></div>
                    <button onClick={() => insertTag('a')} className="p-1.5 text-zinc-400 hover:text-zinc-100 transition-colors" title="Link"><LinkIcon className="w-4 h-4" /></button>
                    <button onClick={() => insertTag('img', 'img')} className="p-1.5 text-zinc-400 hover:text-zinc-100 transition-colors" title="Image"><ImageIcon className="w-4 h-4" /></button>
                    <div className="flex-1"></div>
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">{content.trim() ? content.trim().split(/\s+/).length : 0} words</span>
                </div>

                <div className="flex-1 p-6 sm:p-10 space-y-6 flex flex-col">
                    <div className="flex flex-col sm:flex-row gap-4 mb-2">
                        <div className="flex-1 relative">
                            <Hash className="w-3.5 h-3.5 text-zinc-600 absolute left-3 top-2.5" />
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-md py-2 pl-9 pr-4 text-xs font-medium text-zinc-300 focus:outline-none focus:border-zinc-500"
                            >
                                <option value="" disabled>Category...</option>
                                <option value="campus">Campus News</option>
                                <option value="tech">Technology</option>
                                <option value="events">Events</option>
                                <option value="sports">Sports</option>
                                <option value="lifestyle">Lifestyle</option>
                                <option value="career">Career</option>
                                <option value="culture">Arts & Culture</option>
                            </select>
                        </div>
                        <div className="flex-[2] relative">
                            <ImageIcon className="w-3.5 h-3.5 text-zinc-600 absolute left-3 top-2.5" />
                            <input
                                type="text"
                                value={coverImage}
                                onChange={e => setCoverImage(e.target.value)}
                                placeholder="Cover Image URL (e.g. Unsplash)..."
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-md py-1.5 pl-9 pr-4 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                            />
                        </div>
                    </div>

                    <textarea
                        placeholder="Title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full bg-transparent text-3xl sm:text-4xl font-bold text-zinc-100 placeholder:text-zinc-700 resize-none focus:outline-none h-14 leading-tight"
                        autoFocus
                    />

                    <div className="border-t border-zinc-900" />

                    <textarea
                        ref={contentRef}
                        placeholder="Start writing HTML enabled content..."
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        className="w-full flex-1 min-h-[300px] bg-transparent text-base text-zinc-300 placeholder:text-zinc-700 resize-none focus:outline-none leading-relaxed"
                    />
                </div>
            </div>
        </div>
    );
}
