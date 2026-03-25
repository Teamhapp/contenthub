"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IconUser, IconCheck } from "@/components/ui/Icons";

export default function FollowButton({ userId, initialFollowing = false, onToggle }: {
  userId: string;
  initialFollowing?: boolean;
  onToggle?: (following: boolean) => void;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  if (session?.user?.id === userId) return null;

  async function handleToggle() {
    if (!session) return router.push("/auth/login");
    setLoading(true);

    const res = await fetch(`/api/users/${userId}/follow`, {
      method: following ? "DELETE" : "POST",
    });

    if (res.ok) {
      setFollowing(!following);
      onToggle?.(!following);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
        following
          ? "bg-surface-100 text-surface-700 hover:bg-red-50 hover:text-red-600"
          : "bg-brand-600 text-white hover:bg-brand-700 shadow-soft-sm"
      }`}
    >
      {following ? <IconCheck className="w-4 h-4" /> : <IconUser className="w-4 h-4" />}
      {loading ? "..." : following ? "Following" : "Follow"}
    </button>
  );
}
