"use client";

import { useSession } from "next-auth/react";
import { Clock, TrendingUp, ThumbsUp, MessageSquare, Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const DUMMY_ARTICLES = [
    {
        id: 1,
        title: "The Future of AI in Modern Education",
        excerpt: "Exploring how artificial intelligence is reshaping the learning curve for students and educators globally. We look into the most pressing challenges...",
        category: "Technology",
        author: "Dr. Alan Turing",
        timeAgo: "2 hours ago",
        readTime: "5 min read",
        likes: 128,
        comments: 45,
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Campus Sustainability Initiatives Hit New Milestone",
        excerpt: "The university's latest report shows a 30% reduction in carbon footprint following the recent solar panel installations.",
        category: "Campus News",
        author: "Sarah Jenkins",
        timeAgo: "4 hours ago",
        readTime: "3 min read",
        likes: 342,
        comments: 12,
        image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Annual Tech Symposium Announces Keynote Speakers",
        excerpt: "Industry leaders from top tech giants are set to discuss the implications of Web3 and quantum computing this fall.",
        category: "Events",
        author: "Michael Chang",
        timeAgo: "8 hours ago",
        readTime: "4 min read",
        likes: 89,
        comments: 8,
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop"
    }
];

export default function ReaderDashboard() {
    const { data: session } = useSession();
    const userName = session?.user?.name || (session?.user as any)?.email?.split("@")[0] || "Reader";

    return (
        <div className="space-y-8 pb-12">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-900">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-100 mb-1">Good morning, {userName}</h1>
                    <p className="text-zinc-500 text-sm">Here's the latest news curated just for you.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md hover:bg-zinc-800 transition-colors text-xs font-semibold text-zinc-300">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Trending
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md hover:bg-zinc-800 transition-colors text-xs font-semibold text-zinc-300">
                        <Clock className="w-3.5 h-3.5" />
                        Recent
                    </button>
                </div>
            </div>

            {/* Featured Article */}
            {DUMMY_ARTICLES.length > 0 && (
                <div className="group rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 flex flex-col md:flex-row">
                    <div className="relative w-full md:w-2/5 min-h-[250px] bg-zinc-900">
                        <Image
                            src={DUMMY_ARTICLES[0].image}
                            alt="Featured cover"
                            fill
                            className="object-cover opacity-80"
                        />
                    </div>

                    <div className="p-6 md:p-8 flex flex-col justify-center flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-2 py-0.5 border border-zinc-700 bg-zinc-900 text-zinc-300 text-[10px] font-bold uppercase tracking-wider rounded-sm">
                                {DUMMY_ARTICLES[0].category}
                            </span>
                            <span className="text-zinc-500 text-xs flex items-center gap-1"><Clock className="w-3" /> {DUMMY_ARTICLES[0].readTime}</span>
                        </div>
                        <Link href={`/dashboard/reader/${DUMMY_ARTICLES[0].id}`}>
                            <h2 className="text-2xl md:text-3xl font-bold text-zinc-100 leading-tight mb-3 hover:underline cursor-pointer">
                                {DUMMY_ARTICLES[0].title}
                            </h2>
                        </Link>
                        <p className="text-zinc-400 text-sm max-w-xl mb-6 leading-relaxed">
                            {DUMMY_ARTICLES[0].excerpt}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-md bg-zinc-900 flex items-center justify-center font-bold text-zinc-300 border border-zinc-800 text-xs">
                                    {DUMMY_ARTICLES[0].author.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-zinc-200">{DUMMY_ARTICLES[0].author}</p>
                                    <p className="text-[10px] text-zinc-500">{DUMMY_ARTICLES[0].timeAgo}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors text-xs font-medium">
                                    <ThumbsUp className="w-3.5 h-3.5" /> {DUMMY_ARTICLES[0].likes}
                                </button>
                                <button className="flex items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors text-xs font-medium">
                                    <MessageSquare className="w-3.5 h-3.5" /> {DUMMY_ARTICLES[0].comments}
                                </button>
                                <button className="p-1.5 hover:bg-zinc-900 rounded transition-colors text-zinc-500 border border-transparent hover:border-zinc-800 hidden sm:block">
                                    <Bookmark className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Recommended News Grid */}
            <div>
                <h3 className="text-lg font-bold text-zinc-200 mb-4 flex items-center gap-2">
                    More Stories
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {DUMMY_ARTICLES.slice(1).map((article) => (
                        <div key={article.id} className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden flex flex-col">
                            <div className="h-40 relative bg-zinc-900 border-b border-zinc-800">
                                <Image src={article.image} alt="Cover" fill className="object-cover opacity-80" />
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                                <div className="mb-2">
                                    <span className="px-2 py-0.5 border border-zinc-800 bg-zinc-900 text-zinc-400 text-[10px] font-bold uppercase tracking-wider rounded-sm">
                                        {article.category}
                                    </span>
                                </div>
                                <Link href={`/dashboard/reader/${article.id}`}>
                                    <h4 className="text-base font-bold text-zinc-100 mb-2 leading-tight hover:underline cursor-pointer">
                                        {article.title}
                                    </h4>
                                </Link>
                                <p className="text-zinc-400 text-xs mb-4 line-clamp-3 leading-relaxed flex-1">
                                    {article.excerpt}
                                </p>
                                <div className="pt-4 border-t border-zinc-900 flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-zinc-300">{article.author}</span>
                                    </div>
                                    <span className="text-[10px] text-zinc-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {article.timeAgo}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
