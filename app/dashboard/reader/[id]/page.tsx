"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Share2, Bookmark, ThumbsUp, MessageSquare, IterationCcw } from "lucide-react";

// In a real app, this would be fetched based on the article ID
// Adding multiple mock articles mapping to IDs 1, 2, and 3.
const DUMMY_ARTICLES = [
    {
        id: "1",
        title: "The Future of AI in Modern Education",
        subtitle: "Exploring how artificial intelligence is reshaping the learning curve for students and educators globally. We look into the most pressing challenges.",
        category: "Technology",
        author: "Dr. Alan Turing",
        authorBio: "Head of AI Research at the CS Department. Passionate about machine learning ethics and scalable computing.",
        date: "October 12, 2026",
        readTime: "5 min read",
        likes: 128,
        comments: 45,
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop",
        content: `
      <p>Artificial Intelligence is no longer just a subject taught in computer science departments; it is an active participant in how education is delivered across all disciplines. As universities rapidly deploy AI-assisted grading, intelligent tutoring systems, and predictive analytics, the landscape of higher education is undergoing a fundamental shift.</p>
      <h2>Personalized Learning Paths</h2>
      <p>One of the most significant advantages of AI in education is its ability to tailor the curriculum to individual student needs. By analyzing the speed at which a student completes assignments and identifying areas where they struggle, AI systems can adapt the difficulty of future tasks. This ensures that students are neither bored by material that is too easy nor overwhelmed by material that is too difficult.</p>
      <blockquote>"The goal is not to replace the teacher, but to superpower them. AI handles the rote mechanics of grading and data tracking, allowing the educator to focus on mentorship."</blockquote>
      <h2>Ethical Considerations and Plagiarism</h2>
      <p>However, the rise of advanced generative AI models has also introduced new challenges. Institutions are grappling with the definition of original work in an era where an AI can generate a passable thesis in seconds. The focus is shifting from "how do we detect AI-generated content?" to "how do we design assessments that measure true comprehension and critical thinking?"</p>
      <p>As we move to the next generation of academic frameworks, the emphasis must remain on the human element: creativity, empathy, and collaborative problem-solving—skills that AI currently cannot replicate.</p>
    `
    },
    {
        id: "2",
        title: "Campus Sustainability Initiatives Hit New Milestone",
        subtitle: "The university's latest report shows a 30% reduction in carbon footprint following the recent solar panel installations.",
        category: "Campus News",
        author: "Sarah Jenkins",
        authorBio: "Environmental Science student and policy advocate leading the Green Campus Initiative.",
        date: "October 14, 2026",
        readTime: "3 min read",
        likes: 342,
        comments: 12,
        image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=1200&auto=format&fit=crop",
        content: `
      <p>The latest environmental report released by the Dean's office shows a promising 30% reduction in carbon emissions across the main campus. Much of this has been credited to the widespread adoption of rooftop solar panels installed last semester on the engineering and arts buildings.</p>
      <p>With an increasing portion of our electricity now being sourced internally via renewable means, the university has successfully reduced reliance on the main grid during peak hours.</p>
      <h2>Water Conservation Expansion</h2>
      <p>Following the successful energy transition, the administration is now looking towards scaling the rainwater harvesting project previously piloted at the dormitories...</p>
    `
    },
    {
        id: "3",
        title: "Annual Tech Symposium Announces Keynote Speakers",
        subtitle: "Industry leaders from top tech giants are set to discuss the implications of Web3 and quantum computing this fall.",
        category: "Events",
        author: "Michael Chang",
        authorBio: "President of the Computing Society. Tech enthusiest and event organizer.",
        date: "October 15, 2026",
        readTime: "4 min read",
        likes: 89,
        comments: 8,
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
        content: `
      <p>The annual Tech Symposium is just around the corner, and this year promises to be the biggest event the campus has ever seen. For the first time, multiple directors from top-tier open source foundations will be flying in to deliver the opening address.</p>
      <h2>What to Expect</h2>
      <p>Main topics on this year's agenda include practical implementations of quantum computing in the fintech sector, and the shifting dynamics of global data privacy regulations.</p>
      <p>The event will feature interactive booths, live hacking challenges, and extensive networking opportunities for senior students preparing for graduation.</p>
    `
    }
];

export default function ArticleReadPage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const article = DUMMY_ARTICLES.find(a => a.id === unwrappedParams.id) || DUMMY_ARTICLES[0];

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <Link href="/dashboard/reader" className="text-zinc-500 hover:text-zinc-300 flex items-center gap-2 transition-colors w-fit text-sm font-medium pt-2">
                <ArrowLeft className="w-4 h-4" />
                Back to feed
            </Link>

            <article className="bg-zinc-950 border border-zinc-900 rounded-lg overflow-hidden mt-4">
                {/* Cover Image */}
                <div className="w-full h-[400px] relative bg-zinc-900 border-b border-zinc-900">
                    <Image
                        src={article.image}
                        alt="Article cover"
                        fill
                        className="object-cover opacity-90"
                        priority
                    />
                </div>

                {/* Article Header */}
                <div className="p-8 md:p-12 pb-6 border-b border-zinc-900">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-2 py-0.5 border border-zinc-700 bg-zinc-900 text-zinc-300 text-[10px] font-bold uppercase tracking-wider rounded-sm">
                            {article.category}
                        </span>
                        <span className="text-zinc-500 text-xs flex items-center gap-1"><Clock className="w-3" /> {article.readTime}</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold text-zinc-100 tracking-tight leading-[1.1] mb-6">
                        {article.title}
                    </h1>
                    <p className="text-xl text-zinc-400 font-medium leading-relaxed mb-8">
                        {article.subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-zinc-900">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-zinc-300 text-lg">
                                {article.author.charAt(0)}
                            </div>
                            <div>
                                <p className="text-base font-semibold text-zinc-200">{article.author}</p>
                                <p className="text-xs text-zinc-500">{article.date}</p>
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
                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                </div>

                {/* Footer Actions */}
                <div className="px-8 md:px-12 py-6 border-t border-zinc-900 flex items-center gap-6 bg-zinc-950 text-sm">
                    <button className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors font-medium">
                        <ThumbsUp className="w-5 h-5" />
                        <span>{article.likes} Likes</span>
                    </button>
                    <button className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors font-medium">
                        <MessageSquare className="w-5 h-5" />
                        <span>{article.comments} Comments</span>
                    </button>
                </div>
            </article>

            {/* Author Bio Box */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-6 flex flex-col sm:flex-row gap-6 mt-8">
                <div className="w-16 h-16 rounded-md bg-zinc-900 border border-zinc-800 shrink-0 flex items-center justify-center font-bold text-zinc-300 text-2xl">
                    {article.author.charAt(0)}
                </div>
                <div>
                    <h3 className="text-zinc-100 font-bold mb-2 uppercase tracking-wide text-xs">About the Author</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{article.authorBio}</p>
                </div>
            </div>
        </div>
    );
}
