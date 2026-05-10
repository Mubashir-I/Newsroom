"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Send, Image as ImageIcon, Link as LinkIcon, Bold, Italic, List, Hash, Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { uploadToCloudinary } from "@/lib/Upload";
import Image from "next/image";

export default function WriterNewArticle() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [coverImage, setCoverImage] = useState("");

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

    const handleSave = async (status: 'draft' | 'published') => {
        if (!title || !content || !category) {
            alert("Title, Content and Category are required");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/articles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content, category, coverImage, status }),
            });

            if (res.ok) {
                router.push("/dashboard/writer");
            } else {
                const data = await res.json();
                alert(data.message || "Failed to save article");
            }
        } catch (err) {
            alert("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-full flex flex-col pb-12">

            {/* Header Area */}
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
                        disabled={isLoading || isUploading}
                        onClick={() => handleSave('draft')}
                        className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-sm font-semibold rounded-md transition-colors disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        <span className="hidden sm:inline">Save Draft</span>
                    </button>
                    <button 
                        disabled={isLoading || isUploading}
                        onClick={() => handleSave('published')}
                        className="flex items-center gap-2 px-4 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-sm font-bold rounded-md transition-colors disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                        <span>Publish</span>
                    </button>
                </div>
            </div>

            {/* Editor Content Area */}
            <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-md flex flex-col">

                {/* Formatting Toolbar */}
                <div className="h-12 bg-zinc-900/50 border-b border-zinc-800 flex items-center px-4 gap-1">
                    <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="bg-transparent text-xs text-zinc-300 font-semibold focus:outline-none cursor-pointer border-r border-zinc-800 pr-3 mr-2 py-1"
                    >
                        <option value="" disabled>Category...</option>
                        <option value="campus">Campus News</option>
                        <option value="tech">Technology</option>
                        <option value="events">Events</option>
                        <option value="sports">Sports</option>
                    </select>

                    <button className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors"><Bold className="w-4 h-4" /></button>
                    <button className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors"><Italic className="w-4 h-4" /></button>
                    <div className="w-px h-4 bg-zinc-800 mx-1"></div>
                    
                    <div className="flex-1"></div>

                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">{content.split(/\s+/).filter(Boolean).length} words</span>
                </div>

                {/* Editing Inputs */}
                <div className="flex-1 p-6 sm:p-10 space-y-6 flex flex-col">

                    {/* Metadata */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-2">
                        <div className="flex-[2] relative">
                            <label className="flex items-center gap-3 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-md cursor-pointer hover:bg-zinc-800 transition-colors w-full sm:w-fit">
                                {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-zinc-500" /> : <Upload className="w-4 h-4 text-zinc-400" />}
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
                                <div className="mt-4 relative w-full h-48 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900/50">
                                    <Image 
                                        src={coverImage} 
                                        alt="Cover preview" 
                                        fill 
                                        className="object-cover"
                                    />
                                    <button 
                                        onClick={() => setCoverImage("")}
                                        className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/80 transition-colors"
                                    >
                                        <ArrowLeft className="w-4 h-4 rotate-45" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <textarea
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-transparent text-3xl sm:text-4xl font-bold text-zinc-100 placeholder:text-zinc-700 resize-none focus:outline-none h-14 leading-tight"
                        autoFocus
                    />

                    <textarea
                        placeholder="Start writing..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full flex-1 min-h-[300px] bg-transparent text-base text-zinc-300 placeholder:text-zinc-700 resize-none focus:outline-none leading-relaxed"
                    />
                </div>

            </div>
        </div>
    );
}
