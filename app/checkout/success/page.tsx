"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { IconCheck, IconArrowRight, IconLibrary, IconShield } from "@/components/ui/Icons";

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");

  const confettiDots = [
    { color: "bg-amber-400", size: "w-3 h-3", top: "-8px", left: "10%", delay: "0s" },
    { color: "bg-brand-400", size: "w-2.5 h-2.5", top: "5%", right: "12%", delay: "0.3s" },
    { color: "bg-purple-400", size: "w-2 h-2", top: "2%", left: "25%", delay: "0.7s" },
    { color: "bg-pink-400", size: "w-3.5 h-3.5", bottom: "20%", left: "8%", delay: "1.1s" },
    { color: "bg-emerald-400", size: "w-2 h-2", top: "15%", right: "25%", delay: "0.5s" },
    { color: "bg-brand-300", size: "w-2.5 h-2.5", bottom: "30%", right: "10%", delay: "1.4s" },
    { color: "bg-amber-300", size: "w-1.5 h-1.5", top: "30%", left: "5%", delay: "0.9s" },
    { color: "bg-purple-300", size: "w-2 h-2", bottom: "15%", right: "20%", delay: "1.7s" },
    { color: "bg-pink-300", size: "w-3 h-3", top: "10%", left: "40%", delay: "0.2s" },
    { color: "bg-emerald-300", size: "w-1.5 h-1.5", bottom: "25%", left: "30%", delay: "1.3s" },
    { color: "bg-[#5d3fd3]", size: "w-2 h-2", top: "8%", right: "35%", delay: "0.6s" },
    { color: "bg-amber-500", size: "w-2.5 h-2.5", bottom: "10%", right: "30%", delay: "2s" },
  ];

  return (
    <div className="relative max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center animate-fade-in overflow-hidden">
      {/* Confetti Dots */}
      {confettiDots.map((dot, i) => (
        <div
          key={i}
          className={`absolute ${dot.size} rounded-full ${dot.color} animate-float opacity-60`}
          style={{
            top: dot.top,
            left: dot.left,
            right: dot.right,
            bottom: dot.bottom,
            animationDelay: dot.delay,
            animationDuration: "3s",
          } as React.CSSProperties}
        />
      ))}

      {/* Animated Checkmark with Glow Ring */}
      <div className="relative w-32 h-32 mx-auto mb-10">
        {/* Outer pulsing glow ring */}
        <div className="absolute inset-0 rounded-full bg-emerald-200/40 animate-pulse" />
        <div className="absolute inset-2 rounded-full bg-emerald-100 animate-scale-in" />
        <div
          className="absolute inset-4 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center animate-scale-in shadow-lg shadow-emerald-500/40"
          style={{ animationDelay: "0.2s" }}
        >
          <IconCheck className="w-12 h-12 text-white" />
        </div>
        {/* Secondary pulsing ring */}
        <div
          className="absolute -inset-3 rounded-full border-2 border-emerald-300/30 animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      <h1 className="text-4xl font-['Plus_Jakarta_Sans'] font-bold text-[#151b29] mb-3">Purchase Complete!</h1>
      <p className="text-[#797586] text-lg mb-6 max-w-md mx-auto">
        Your content is now available in your library. Start enjoying it right away.
      </p>

      {/* Transaction ID Chip */}
      {transactionId && (
        <div className="inline-flex items-center gap-2 bg-[#f1f3ff] border border-[#e2e8fc] px-4 py-2 rounded-full mb-10">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#797586]">TX</span>
          <span className="text-xs font-mono text-[#484554] tracking-wide">{transactionId}</span>
        </div>
      )}

      {/* What's Next Section */}
      <div className="mt-4 mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#797586] mb-5">What&apos;s next?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          <Link
            href="/dashboard/library"
            className="card p-6 text-center group hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
              <IconLibrary className="w-6 h-6 text-[#451ebb]" />
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[#151b29] mb-1">Go to Library</h3>
            <p className="text-xs text-[#797586]">Access your purchased content</p>
          </Link>
          <Link
            href="/browse"
            className="card p-6 text-center group hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
              <IconArrowRight className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[#151b29] mb-1">Browse More</h3>
            <p className="text-xs text-[#797586]">Discover more great content</p>
          </Link>
        </div>
      </div>

      {/* Trust Badge */}
      <div className="inline-flex items-center gap-2 text-[#797586] text-xs bg-[#faf8ff] border border-[#f1f3ff] rounded-full px-5 py-2.5">
        <IconShield className="w-4 h-4 text-emerald-500" />
        <span>Secure purchase &mdash; 100% satisfaction guaranteed</span>
      </div>
    </div>
  );
}
