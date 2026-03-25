"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ContentCard from "@/components/content/ContentCard";
import { IconTrending, IconSparkles, IconArrowRight } from "@/components/ui/Icons";

interface FeedContent {
  _id: string;
  title: string;
  description: string;
  type: string;
  price: number;
  thumbnailUrl?: string;
  averageRating: number;
  totalSales: number;
  viewCount?: number;
  creator?: { name: string; image?: string };
  category?: { name: string };
}

export default function FeedPage() {
  const [fromFollowing, setFromFollowing] = useState<FeedContent[]>([]);
  const [recommended, setRecommended] = useState<FeedContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/feed")
      .then((r) => r.json())
      .then((data) => {
        setFromFollowing(Array.isArray(data.fromFollowing) ? data.fromFollowing : []);
        setRecommended(Array.isArray(data.recommended) ? data.recommended : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="section-title text-2xl">Your Feed</h1>
        <p className="text-surface-500 mt-1">
          Content from creators you follow and personalized recommendations
        </p>
      </div>

      {loading ? (
        <div className="space-y-10">
          {[0, 1].map((section) => (
            <div key={section}>
              <div className="skeleton h-6 rounded w-48 mb-5" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card p-0 overflow-hidden animate-stagger-fade" style={{ animationDelay: `${i * 80}ms` }}>
                    <div className="skeleton aspect-[16/10]" />
                    <div className="p-4 space-y-3">
                      <div className="skeleton h-5 rounded w-3/4" />
                      <div className="skeleton h-3 rounded w-full" />
                      <div className="skeleton h-3 rounded w-1/2" />
                      <div className="divider-gradient" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="skeleton w-6 h-6 rounded-md" />
                          <div className="skeleton h-3 rounded w-20" />
                        </div>
                        <div className="skeleton h-3 rounded w-12" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* From Creators You Follow */}
          <section>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
                <IconTrending className="w-4.5 h-4.5 text-brand-600" />
              </div>
              <h2 className="font-display font-bold text-lg text-surface-900">
                From Creators You Follow
              </h2>
            </div>

            {fromFollowing.length === 0 ? (
              <div className="card text-center py-14">
                <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-surface-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </div>
                <p className="text-surface-500 text-lg mb-1 font-medium">
                  Follow creators to see their content here
                </p>
                <p className="text-surface-400 text-sm mb-6">
                  Discover amazing creators and stay up to date with their latest work.
                </p>
                <Link
                  href="/browse"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <IconSparkles className="w-4 h-4" />
                  Browse Creators
                  <IconArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {fromFollowing.map((content: FeedContent, i: number) => (
                  <div key={content._id} className="animate-stagger-fade" style={{ animationDelay: `${i * 60}ms` }}>
                    <ContentCard content={content} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recommended For You */}
          <section>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                <IconSparkles className="w-4.5 h-4.5 text-purple-600" />
              </div>
              <h2 className="font-display font-bold text-lg text-surface-900">
                Recommended For You
              </h2>
            </div>

            {recommended.length === 0 ? (
              <div className="card text-center py-14">
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <IconSparkles className="w-8 h-8 text-surface-400" />
                  </div>
                  <p className="text-surface-500 text-lg mb-1 font-medium">
                    No recommendations yet
                  </p>
                  <p className="text-surface-400 text-sm mb-6">
                    We&apos;re learning your preferences. Browse and interact with content to get personalized recommendations.
                  </p>
                  <Link
                    href="/browse"
                    className="btn-secondary inline-flex items-center gap-2"
                  >
                    Explore Content
                    <IconArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {recommended.map((content: FeedContent, i: number) => (
                  <div key={content._id} className="animate-stagger-fade" style={{ animationDelay: `${i * 60}ms` }}>
                    <ContentCard content={content} />
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
