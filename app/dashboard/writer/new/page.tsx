"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Send, Image as ImageIcon, Link as LinkIcon, Bold, Italic, List, Hash } from "lucide-react";

export default function WriterNewArticle() {
    const router = useRouter();

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
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-sm font-semibold rounded-md transition-colors">
                        <Save className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Save Draft</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-sm font-bold rounded-md transition-colors">
                        <Send className="w-3.5 h-3.5" />
                        <span>Publish</span>
                    </button>
                </div>
            </div>

            {/* Editor Content Area */}
            <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-md flex flex-col">

                {/* Formatting Toolbar */}
                <div className="h-12 bg-zinc-900/50 border-b border-zinc-800 flex items-center px-4 gap-1">
                    <select className="bg-transparent text-xs text-zinc-300 font-semibold focus:outline-none cursor-pointer border-r border-zinc-800 pr-3 mr-2 py-1">
                        <option value="p">Paragraph</option>
                        <option value="h1">Heading 1</option>
                        <option value="h2">Heading 2</option>
                    </select>

                    <button className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors"><Bold className="w-4 h-4" /></button>
                    <button className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors"><Italic className="w-4 h-4" /></button>
                    <div className="w-px h-4 bg-zinc-800 mx-1"></div>
                    <button className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors"><LinkIcon className="w-4 h-4" /></button>
                    <button className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors"><ImageIcon className="w-4 h-4" /></button>
                    <button className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors"><List className="w-4 h-4" /></button>

                    <div className="flex-1"></div>

                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">0 words</span>
                </div>

                {/* Editing Inputs */}
                <div className="flex-1 p-6 sm:p-10 space-y-6 flex flex-col">

                    {/* Metadata */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-2">
                        <div className="flex-1 relative">
                            <Hash className="w-3.5 h-3.5 text-zinc-600 absolute left-3 top-2.5" />
                            <select className="w-full bg-zinc-950 border border-zinc-800 rounded-md py-2 pl-9 pr-4 text-xs font-medium text-zinc-300 focus:outline-none focus:border-zinc-500 appearance-none">
                                <option value="" disabled selected>Category...</option>
                                <option value="campus">Campus News</option>
                                <option value="tech">Technology</option>
                                <option value="events">Events</option>
                            </select>
                        </div>
                        <div className="flex-[2] relative">
                            <ImageIcon className="w-3.5 h-3.5 text-zinc-600 absolute left-3 top-2.5" />
                            <input type="text" placeholder="Cover Image URL..." className="w-full bg-zinc-950 border border-zinc-800 rounded-md py-1.5 pl-9 pr-4 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500" />
                        </div>
                    </div>

                    <textarea
                        placeholder="Title"
                        className="w-full bg-transparent text-3xl sm:text-4xl font-bold text-zinc-100 placeholder:text-zinc-700 resize-none focus:outline-none h-14 leading-tight"
                        autoFocus
                    />

                    <textarea
                        placeholder="Start writing..."
                        className="w-full flex-1 min-h-[300px] bg-transparent text-base text-zinc-300 placeholder:text-zinc-700 resize-none focus:outline-none leading-relaxed"
                    />
                </div>

            </div>
        </div>
    );
}
