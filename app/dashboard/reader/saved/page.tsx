"use client";

import { useSession } from "next-auth/react";
import { Loader2, Bookmark } from "lucide-react";

// Placeholder for saved articles feature
// This would require a `savedArticles` field on the User model
export default function SavedArticlesPage() {
    const { data: session } = useSession();

    return (
        <div className="space-y-8 pb-12">
            <div className="pb-6 border-b border-zinc-900">
                <h1 className="text-2xl font-bold text-zinc-100">Saved Articles</h1>
                <p className="text-zinc-500 text-sm mt-1">Articles you've bookmarked for later.</p>
            </div>

            <div className="flex flex-col items-center justify-center py-24 border border-dashed border-zinc-800 rounded-lg text-center gap-4">
                <Bookmark className="w-10 h-10 text-zinc-700" />
                <div>
                    <p className="text-zinc-400 font-semibold">No saved articles yet</p>
                    <p className="text-zinc-600 text-sm mt-1">When you save articles, they'll appear here.</p>
                </div>
            </div>
        </div>
    );
}
