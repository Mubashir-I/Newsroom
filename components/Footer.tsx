import Link from "next/link";
import { Globe, Link as LinkIcon, Mail, Info } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="w-full border-t border-zinc-900 bg-zinc-950 py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-xl font-bold text-zinc-100 tracking-tighter flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-zinc-100 rounded flex items-center justify-center">
                <div className="w-4 h-4 bg-zinc-950 rounded-sm rotate-45" />
              </div>
              NEWSROOM
            </Link>
            <p className="text-zinc-500 text-sm max-w-sm leading-relaxed">
              Empowering independent journalism and storytelling. Join our community of writers and readers exploring the stories that matter.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-zinc-100 font-semibold mb-4 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/articles" className="text-zinc-500 hover:text-zinc-100 transition-colors">Browse Articles</Link>
              </li>
              <li>
                <Link href="/dashboard/writer" className="text-zinc-500 hover:text-zinc-100 transition-colors">Become a Writer</Link>
              </li>
              <li>
                <Link href="/dashboard/reader" className="text-zinc-500 hover:text-zinc-100 transition-colors">Reader Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-zinc-100 font-semibold mb-4 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-zinc-500 hover:text-zinc-100 transition-colors">Help Center</Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-500 hover:text-zinc-100 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-500 hover:text-zinc-100 transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-600 text-xs">
            &copy; {new Date().getFullYear()} Newsroom. All rights reserved.
          </p>
          
          <div className="flex items-center gap-5">
            <Link href="#" className="text-zinc-600 hover:text-zinc-100 transition-colors">
              <Globe className="w-4 h-4" />
            </Link>
            <Link href="#" className="text-zinc-600 hover:text-zinc-100 transition-colors">
              <LinkIcon className="w-4 h-4" />
            </Link>
            <Link href="#" className="text-zinc-600 hover:text-zinc-100 transition-colors">
              <Info className="w-4 h-4" />
            </Link>
            <Link href="mailto:mmi.revival@gmail.com" className="text-zinc-600 hover:text-zinc-100 transition-colors">
              <Mail className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
