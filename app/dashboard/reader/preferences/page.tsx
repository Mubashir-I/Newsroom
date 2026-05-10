"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, Circle, Save } from "lucide-react";

const ALL_CATEGORIES = [
    { id: "campus", label: "Campus News", emoji: "🏫" },
    { id: "tech", label: "Technology", emoji: "💻" },
    { id: "events", label: "Events", emoji: "🎉" },
    { id: "sports", label: "Sports", emoji: "⚽" },
    { id: "science", label: "Science", emoji: "🔬" },
    { id: "culture", label: "Arts & Culture", emoji: "🎨" },
    { id: "politics", label: "Politics", emoji: "🏛️" },
    { id: "health", label: "Health", emoji: "🩺" },
];

export default function ReaderPreferencesPage() {
    const { data: session } = useSession();
    const [interests, setInterests] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const fetchInterests = async () => {
            try {
                const res = await fetch('/api/users/interests');
                if (res.ok) {
                    const data = await res.json();
                    setInterests(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        if (session) fetchInterests();
    }, [session]);

    const toggleInterest = (id: string) => {
        setSaved(false);
        setInterests(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await fetch('/api/users/interests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ interests }),
            });
            setSaved(true);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return (
        <div className="min-h-[400px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
        </div>
    );

    return (
        <div className="max-w-2xl space-y-8 pb-12">
            <div className="pb-6 border-b border-zinc-900">
                <h1 className="text-2xl font-bold text-zinc-100">Preferences</h1>
                <p className="text-zinc-500 text-sm mt-1">Choose topics you care about to personalize your feed.</p>
            </div>

            <div className="space-y-4">
                <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Your Interests</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {ALL_CATEGORIES.map((cat) => {
                        const isSelected = interests.includes(cat.id);
                        return (
                            <button
                                key={cat.id}
                                onClick={() => toggleInterest(cat.id)}
                                className={`flex items-center gap-3 p-4 rounded-lg border text-left transition-all ${
                                    isSelected
                                        ? 'bg-zinc-100 border-zinc-100 text-zinc-900'
                                        : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-900'
                                }`}
                            >
                                <span className="text-xl">{cat.emoji}</span>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold leading-tight">{cat.label}</p>
                                </div>
                                {isSelected
                                    ? <CheckCircle2 className="w-4 h-4 text-zinc-700 shrink-0" />
                                    : <Circle className="w-4 h-4 text-zinc-700 shrink-0" />
                                }
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-md font-semibold text-sm transition-colors disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Preferences
                </button>
                {saved && (
                    <span className="text-sm text-emerald-500 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Saved! Your feed will update.
                    </span>
                )}
            </div>

            <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                <p className="text-zinc-500 text-sm">
                    <strong className="text-zinc-300">Tip:</strong> Articles matching your selected interests will appear first in your "Latest News" feed.
                </p>
            </div>
        </div>
    );
}
