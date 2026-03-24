"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { IconCheck, IconArrowRight, IconLibrary } from "@/components/ui/Icons";

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

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center animate-fade-in">
      {/* Animated checkmark */}
      <div className="relative w-24 h-24 mx-auto mb-8">
        <div className="absolute inset-0 rounded-full bg-emerald-100 animate-scale-in" />
        <div className="absolute inset-2 rounded-full bg-emerald-500 flex items-center justify-center animate-scale-in" style={{ animationDelay: "0.2s" }}>
          <IconCheck className="w-10 h-10 text-white" />
        </div>
        {/* Celebration dots */}
        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-amber-400 animate-float" />
        <div className="absolute -bottom-1 -left-3 w-3 h-3 rounded-full bg-brand-400 animate-float" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-0 -left-4 w-2 h-2 rounded-full bg-purple-400 animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute -bottom-3 right-0 w-3 h-3 rounded-full bg-pink-400 animate-float" style={{ animationDelay: "1.5s" }} />
      </div>

      <h1 className="text-3xl font-display font-bold text-surface-900 mb-3">Purchase Complete!</h1>
      <p className="text-surface-500 text-lg mb-2">Your content is now available in your library.</p>
      {transactionId && (
        <p className="text-xs text-surface-400 font-mono bg-surface-100 inline-block px-3 py-1 rounded-lg mb-8">
          TX: {transactionId}
        </p>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
        <Link href="/dashboard/library" className="btn-primary px-8 py-3 text-base">
          <IconLibrary className="w-5 h-5" />
          Go to Library
        </Link>
        <Link href="/browse" className="btn-secondary px-8 py-3 text-base">
          Browse More
          <IconArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
