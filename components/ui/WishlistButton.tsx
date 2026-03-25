"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function WishlistButton({ contentId, initialWishlisted = false, size = "md" }: {
  contentId: string;
  initialWishlisted?: boolean;
  size?: "sm" | "md";
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [loading, setLoading] = useState(false);

  async function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!session) return router.push("/auth/login");
    setLoading(true);

    const res = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentId }),
    });

    if (res.ok) {
      const data = await res.json();
      setWishlisted(data.wishlisted);
    }
    setLoading(false);
  }

  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const btnSize = size === "sm" ? "p-1.5" : "p-2";

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`${btnSize} rounded-lg transition-all duration-200 ${
        wishlisted
          ? "text-red-500 hover:text-red-600 bg-red-50"
          : "text-surface-400 hover:text-red-500 hover:bg-red-50"
      }`}
      title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <svg className={iconSize} viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth={wishlisted ? 0 : 1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    </button>
  );
}
