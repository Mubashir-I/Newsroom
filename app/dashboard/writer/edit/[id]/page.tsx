"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Send, Loader2, Upload } from "lucide-react";
import { useEffect, useState, use } from "react";
import { uploadToCloudinary } from "@/lib/Upload";
import Image from "next/image";

const CATEGORIES = [
    { value: "campus", label: "Campus News" },
    { value: "tech", label: "Technology" },
    { value: "events", label: "Events" },
    { value: "sports", label: "Sports" },
    { value: "science", label: "Science" },
    { value: "culture", label: "Arts & Culture" },
    { value: "politics", label: "Politics" },
    { value: "health", label: "Health" },
];

export default function WriterEditArticle({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("campus");
    const [coverImage, setCoverImage] = useState("");
    const [status, setStatus] = useState("draft");

    useEffect(() => {
        if (!id) return;
        const fetchArticle = async () => {
            setIsLoading(true);
            try {
                // Use the articles list endpoint to get the article without incrementing view count
                const res = await fetch(`/api/articles/${id}`);
                if (!res.ok) {
                    setError("Could not load article.");
                    return;
                }
                const data = await res.json();
                setTitle(data.title || "");
                setContent(data.content || "");
                // Normalize to lowercase to match option values
                setCategory(data.category?.toLowerCase() || "campus");
                setCoverImage(data.coverImage || "");
                setStatus(data.status || "draft");
            } catch (err) {
                setError("Failed to load article.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchArticle();
    }, [id]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            setCoverImage(url);
        } catch (err: any) {
            alert("Upload failed: " + err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleUpdate = async (publishNow = false) => {
        if (!title.trim() || !content.trim() || !category) {
            alert("Title, Content and Category are required.");
            return;
        }
        setIsSaving(true);
        setError("");
        try {
            const res = await fetch(`/api/articles/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title.trim(),
                    content: content.trim(),
                    category,
                    coverImage,
                    status: publishNow ? "published" : status,
                }),
            });

            if (res.ok) {
                router.push("/dashboard/writer");
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.message || "Failed to update article.");
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto flex flex-col pb-12 gap-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-6 border-b border-zinc-900">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-zinc-500 hover:text-zinc-200 transition-colors text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${status === 'published' ? 'text-emerald-400 border-emerald-900 bg-emerald-950' : 'text-zinc-500 border-zinc-800'}`}>
                        {status}
                    </span>
                    <button
                        disabled={isSaving || isUploading}
                        onClick={() => handleUpdate(false)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-sm font-semibold rounded-md transition-colors disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        <span>Save Changes</span>
                    </button>
                    {status === 'draft' && (
                        <button
                            disabled={isSaving || isUploading}
                            onClick={() => handleUpdate(true)}
                            className="flex items-center gap-2 px-4 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-sm font-bold rounded-md transition-colors disabled:opacity-50"
                        >
                            <Send className="w-3.5 h-3.5" />
                            <span>Publish</span>
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-md">
                    {error}
                </div>
            )}

            {/* Editor Area */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
                {/* Toolbar */}
                <div className="h-12 bg-zinc-900/50 border-b border-zinc-800 flex items-center px-4 gap-3">
                    <label className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 font-semibold focus:outline-none rounded px-2 py-1"
                    >
                        {CATEGORIES.map(c => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                    </select>
                </div>

                <div className="p-6 sm:p-10 space-y-6">
                    {/* Cover image upload */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-md cursor-pointer hover:bg-zinc-800 transition-colors w-fit">
                            {isUploading
                                ? <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                                : <Upload className="w-4 h-4 text-zinc-400" />
                            }
                            <span className="text-sm font-medium text-zinc-300">
                                {coverImage ? "Change Cover Image" : "Upload Cover Image"}
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                disabled={isUploading}
                            />
                        </label>
                        {coverImage && (
                            <div className="relative w-full h-52 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
                                <Image src={coverImage} alt="Cover preview" fill className="object-cover" />
                                <button
                                    onClick={() => setCoverImage("")}
                                    className="absolute top-2 right-2 bg-zinc-900/80 text-zinc-300 text-xs px-2 py-1 rounded hover:bg-zinc-800"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <textarea
                        placeholder="Article title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        rows={2}
                        className="w-full bg-transparent text-3xl sm:text-4xl font-bold text-zinc-100 placeholder:text-zinc-700 resize-none focus:outline-none leading-tight"
                    />

                    <div className="border-t border-zinc-900" />

                    {/* Body */}
                    <textarea
                        placeholder="Write your story here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={20}
                        className="w-full bg-transparent text-base text-zinc-300 placeholder:text-zinc-700 resize-none focus:outline-none leading-relaxed"
                    />
                </div>
            </div>
        </div>
    );
}
