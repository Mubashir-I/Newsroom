import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-emerald-600/20 blur-[120px] rounded-full"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
        <div className="mb-12">
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4 drop-shadow-2xl">
                NEWS<span className="text-blue-500">ROOM</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                The next generation of collaborative news reporting. Secure, fast, and intelligent.
            </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link
            href="/login"
            className="flex-1 bg-white text-slate-950 font-bold py-4 px-8 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
          >
            Get Started
          </Link>
          <Link
            href="/signup"
            className="flex-1 bg-slate-900 text-white border border-slate-800 font-bold py-4 px-8 rounded-2xl transition-all hover:bg-slate-800 hover:scale-105 active:scale-95"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-20 flex items-center gap-8 opacity-40 grayscale pointer-events-none">
            <Image src="/next.svg" alt="Next.js" width={100} height={20} className="invert" />
            <div className="w-px h-6 bg-slate-800"></div>
            <span className="text-white font-bold tracking-widest text-xs">V0.1.0-ALPHA</span>
        </div>
      </main>
    </div>
  );
}
