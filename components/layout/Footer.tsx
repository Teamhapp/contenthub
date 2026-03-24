import Link from "next/link";
import { IconArticle, IconVideo, IconFile } from "@/components/ui/Icons";

export default function Footer() {
  return (
    <footer className="bg-surface-900 text-white mt-auto relative">
      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl hero-gradient flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-lg font-bold font-display">ContentHub</span>
            </div>
            <p className="text-surface-400 text-sm leading-relaxed">
              The premium marketplace for digital content. Buy and sell articles, videos, and files from creators worldwide.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-surface-300 mb-4">Marketplace</h4>
            <div className="space-y-3">
              <Link href="/browse" className="flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors">
                Browse All
              </Link>
              <Link href="/browse?type=article" className="flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors">
                <IconArticle className="w-4 h-4" /> Articles
              </Link>
              <Link href="/browse?type=video" className="flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors">
                <IconVideo className="w-4 h-4" /> Videos
              </Link>
              <Link href="/browse?type=file" className="flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors">
                <IconFile className="w-4 h-4" /> Digital Files
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-surface-300 mb-4">For Creators</h4>
            <div className="space-y-3">
              <Link href="/auth/register" className="text-sm text-surface-400 hover:text-white transition-colors block">Start Selling</Link>
              <Link href="/creator" className="text-sm text-surface-400 hover:text-white transition-colors block">Creator Dashboard</Link>
              <Link href="/creator/earnings" className="text-sm text-surface-400 hover:text-white transition-colors block">Earnings</Link>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-surface-300 mb-4">Support</h4>
            <div className="space-y-3">
              <span className="text-sm text-surface-400 block">help@contenthub.com</span>
              <span className="text-sm text-surface-400 block">Terms of Service</span>
              <span className="text-sm text-surface-400 block">Privacy Policy</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-surface-500">
            &copy; {new Date().getFullYear()} ContentHub. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-soft" />
            <span className="text-xs text-surface-500">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
