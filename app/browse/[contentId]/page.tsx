"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/constants";
import Link from "next/link";
import {
  ContentTypeIcon,
  IconStar,
  IconStarOutline,
  IconEye,
  IconCart,
  IconArrowRight,
  IconCheck,
  IconShield,
} from "@/components/ui/Icons";

export default function ContentDetailPage({ params }: { params: { contentId: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchased, setPurchased] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    fetch(`/api/content/${params.contentId}`)
      .then((r) => r.json())
      .then((data) => { if (!data.error) setContent(data); })
      .finally(() => setLoading(false));

    fetch(`/api/content/${params.contentId}/reviews`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setReviews(data); })
      .catch(() => {});
  }, [params.contentId]);

  useEffect(() => {
    if (session) {
      fetch(`/api/content/${params.contentId}/access`)
        .then((r) => { if (r.ok) setPurchased(true); })
        .catch(() => {});
    }
  }, [session, params.contentId]);

  async function handleAddToCart() {
    if (!session) return router.push("/auth/login");
    setAddingToCart(true);
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentId: params.contentId }),
    });
    setAddingToCart(false);
    router.push("/checkout");
  }

  async function handleBuyNow() {
    if (!session) return router.push("/auth/login");
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentIds: [params.contentId] }),
    });
    const data = await res.json();
    if (res.ok) router.push(`/checkout/success?transactionId=${data.transactionId}`);
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    setSubmittingReview(true);
    const res = await fetch(`/api/content/${params.contentId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewForm),
    });
    if (res.ok) {
      const review = await res.json();
      setReviews([review, ...reviews]);
      setReviewForm({ rating: 5, comment: "" });
    }
    setSubmittingReview(false);
  }

  const typeBadgeGlow: Record<string, string> = {
    article: "badge-glow-blue",
    video: "badge-glow-purple",
    file: "badge-glow-green",
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-4 skeleton w-12 rounded" />
          <div className="h-4 skeleton w-4 rounded" />
          <div className="h-4 skeleton w-16 rounded" />
          <div className="h-4 skeleton w-4 rounded" />
          <div className="h-4 skeleton w-32 rounded" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video skeleton rounded-2xl" />
            <div className="h-8 skeleton w-3/4 rounded" />
            <div className="h-5 skeleton w-full rounded" />
            <div className="h-5 skeleton w-2/3 rounded" />
          </div>
          <div className="lg:col-span-1">
            <div className="skeleton rounded-2xl h-72" />
          </div>
        </div>
      </div>
    );
  }

  // --- Not Found State ---
  if (!content) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="empty-state">
          <div className="empty-state-icon">
            <ContentTypeIcon type="file" className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-display font-bold text-surface-900 mt-4">Content Not Found</h1>
          <p className="text-surface-500 mt-2">The content you are looking for does not exist or has been removed.</p>
          <Link href="/browse" className="btn-primary mt-6 inline-flex items-center gap-2">
            <IconArrowRight className="w-4 h-4 rotate-180" />
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  const avgRating = content.averageRating ?? 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fade-in">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-surface-400 mb-8">
        <Link href="/" className="hover:text-surface-700 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/browse" className="hover:text-surface-700 transition-colors">Browse</Link>
        <span>/</span>
        <span className="text-surface-700 font-medium truncate max-w-[260px]">{content.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">

        {/* ========== Main Column ========== */}
        <div className="lg:col-span-2 space-y-8 animate-stagger-fade">

          {/* Hero Thumbnail */}
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-soft-lg group">
            {content.thumbnailUrl ? (
              <>
                <img
                  src={content.thumbnailUrl}
                  alt={content.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Gradient overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-3">
                    <span className={typeBadgeGlow[content.type] || "badge-glow-blue"}>
                      <ContentTypeIcon type={content.type} className="w-3.5 h-3.5" />
                      {content.type}
                    </span>
                    {content.category && (
                      <span className="badge-gray backdrop-blur-sm bg-white/20 text-white border-white/20">
                        {content.category.name}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight mt-3 drop-shadow-lg">
                    {content.title}
                  </h1>
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-surface-100 to-surface-50 flex items-center justify-center">
                <div className="w-24 h-24 rounded-3xl bg-white shadow-soft-md flex items-center justify-center text-surface-400">
                  <ContentTypeIcon type={content.type} className="w-12 h-12" />
                </div>
              </div>
            )}
          </div>

          {/* Title (shown when no thumbnail so it's not buried) */}
          {!content.thumbnailUrl && (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className={typeBadgeGlow[content.type] || "badge-glow-blue"}>
                  <ContentTypeIcon type={content.type} className="w-3.5 h-3.5" />
                  {content.type}
                </span>
                {content.category && (
                  <span className="badge-gray">{content.category.name}</span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 tracking-tight">
                {content.title}
              </h1>
            </div>
          )}

          {/* Stats bar */}
          <div className="flex items-center gap-5 text-sm text-surface-500">
            {avgRating > 0 && (
              <span className="flex items-center gap-1.5">
                <IconStar className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-surface-800">{avgRating.toFixed(1)}</span>
                <span>({content.reviewCount} review{content.reviewCount !== 1 ? "s" : ""})</span>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <IconEye className="w-4 h-4" />
              {content.viewCount} views
            </span>
          </div>

          <div className="divider-gradient" />

          {/* Description */}
          <div>
            <h2 className="section-title mb-3">About this content</h2>
            <p className="text-surface-600 leading-relaxed text-[15px]">{content.description}</p>
          </div>

          {/* Preview */}
          {content.previewContent && (
            <div className="card p-6 bg-gradient-to-br from-brand-50/50 to-purple-50/30 border-brand-100/50">
              <h3 className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <IconEye className="w-3.5 h-3.5" />
                Preview
              </h3>
              <p className="text-surface-700 whitespace-pre-wrap leading-relaxed">{content.previewContent}</p>
            </div>
          )}

          {/* Tags */}
          {content.tags?.length > 0 && (
            <div>
              <h2 className="section-title mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {content.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-surface-100 text-surface-600 rounded-lg text-xs font-medium hover:bg-brand-50 hover:text-brand-600 transition-all duration-200 cursor-default"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="divider-gradient" />

          {/* ========== Reviews Section ========== */}
          <div>
            <h2 className="section-title mb-6">
              Reviews ({content.reviewCount})
            </h2>

            {/* Review Form */}
            {purchased && (
              <form onSubmit={handleSubmitReview} className="card p-6 mb-8 space-y-4 border-brand-100/40">
                <h3 className="font-semibold text-surface-800">Write a Review</h3>
                <div>
                  <p className="text-xs text-surface-400 mb-2">Your rating</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = star <= (hoverRating || reviewForm.rating);
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transition-transform hover:scale-110"
                        >
                          {active
                            ? <IconStar className="w-7 h-7 text-amber-400 drop-shadow-sm" />
                            : <IconStarOutline className="w-7 h-7 text-surface-300" />
                          }
                        </button>
                      );
                    })}
                    {(hoverRating || reviewForm.rating) > 0 && (
                      <span className="text-sm text-surface-500 ml-2 self-center">
                        {hoverRating || reviewForm.rating}/5
                      </span>
                    )}
                  </div>
                </div>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share your experience with this content..."
                  className="input"
                  rows={3}
                />
                <button type="submit" disabled={submittingReview} className="btn-primary">
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}

            {/* Review List */}
            {reviews.length === 0 ? (
              <div className="empty-state py-12">
                <div className="empty-state-icon">
                  <IconStarOutline className="w-7 h-7" />
                </div>
                <p className="text-surface-500 mt-3 text-sm">No reviews yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review: any) => (
                  <div key={review._id} className="card p-5 hover:shadow-soft-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="avatar w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-purple-400 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{review.user?.name?.[0]?.toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-surface-800 truncate">{review.user?.name}</p>
                        <div className="flex gap-0.5 mt-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <IconStar
                              key={star}
                              className={`w-3.5 h-3.5 ${star <= review.rating ? "text-amber-400" : "text-surface-200"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-surface-600 leading-relaxed pl-12">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Related content note */}
          <div className="card p-5 bg-gradient-to-r from-surface-50 to-brand-50/30 border-surface-100">
            <p className="text-sm text-surface-500 text-center">
              Looking for more?{" "}
              <Link href="/browse" className="text-brand-600 font-semibold hover:underline">
                Browse all content
                <IconArrowRight className="w-3.5 h-3.5 inline ml-1 -mt-0.5" />
              </Link>
            </p>
          </div>
        </div>

        {/* ========== Sidebar ========== */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">

            {/* Purchase Card */}
            <div className="card p-6 shadow-soft-lg overflow-hidden relative">
              {/* Gradient price header */}
              <div className="relative -mx-6 -mt-6 mb-6 px-6 py-5 bg-gradient-to-r from-brand-600 via-purple-600 to-brand-600">
                <div className="text-3xl font-display font-bold text-white tracking-tight">
                  {formatPrice(content.price)}
                </div>
                {content.price > 0 && (
                  <p className="text-brand-100 text-xs mt-1">One-time purchase</p>
                )}
              </div>

              {/* Rating & Views */}
              <div className="flex items-center gap-4 text-sm text-surface-500 mb-6">
                {avgRating > 0 && (
                  <span className="flex items-center gap-1">
                    <IconStar className="w-4 h-4 text-amber-400" />
                    <span className="font-medium text-surface-700">{avgRating.toFixed(1)}</span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <IconEye className="w-4 h-4" />
                  {content.viewCount}
                </span>
              </div>

              {/* Action Buttons */}
              {purchased ? (
                <Link
                  href="/dashboard/library"
                  className="flex items-center justify-center gap-2 w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-soft-sm"
                >
                  <IconCheck className="w-5 h-5" />
                  View in Library
                </Link>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleBuyNow}
                    className="w-full btn-glow py-3 text-base justify-center"
                  >
                    Buy Now
                    <IconArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="w-full btn-secondary py-3 justify-center"
                  >
                    <IconCart className="w-4 h-4" />
                    {addingToCart ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              )}

              {/* Trust Indicators */}
              {!purchased && (
                <div className="mt-6 pt-5 border-t border-surface-100 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-surface-500">
                    <IconShield className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-surface-500">
                    <svg className="w-4 h-4 text-brand-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                    <span>Instant access after purchase</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-surface-500">
                    <svg className="w-4 h-4 text-purple-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Lifetime access included</span>
                  </div>
                </div>
              )}
            </div>

            {/* Creator Profile Card */}
            {content.creator && (
              <div className="card p-6 shadow-soft-md">
                <h3 className="text-xs font-bold text-surface-400 uppercase tracking-wider mb-4">Created by</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="avatar w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center ring-2 ring-brand-200 ring-offset-2 flex-shrink-0">
                    <span className="text-white text-base font-bold">{content.creator.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-surface-900 truncate">{content.creator.name}</p>
                    {content.creator.followerCount != null && (
                      <p className="text-xs text-surface-400 mt-0.5">
                        {content.creator.followerCount} follower{content.creator.followerCount !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </div>
                <Link
                  href={`/creator-profile/${content.creator._id}`}
                  className="btn-ghost w-full justify-center text-sm"
                >
                  View Profile
                  <IconArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
