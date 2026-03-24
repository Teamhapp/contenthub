"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/constants";
import Link from "next/link";
import { ContentTypeIcon, IconStar, IconStarOutline, IconEye, IconCart, IconArrowRight, IconCheck } from "@/components/ui/Icons";

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

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-6">
          <div className="h-8 skeleton w-1/2" />
          <div className="aspect-video skeleton rounded-2xl" />
          <div className="h-5 skeleton w-3/4" />
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-display font-bold">Content Not Found</h1>
        <Link href="/browse" className="text-brand-600 hover:underline mt-4 inline-block">Back to Browse</Link>
      </div>
    );
  }

  const typeBadge: Record<string, string> = {
    article: "badge-blue",
    video: "badge-purple",
    file: "badge-green",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video bg-gradient-to-br from-surface-100 to-surface-50 rounded-2xl overflow-hidden shadow-soft-sm">
            {content.thumbnailUrl ? (
              <img src={content.thumbnailUrl} alt={content.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-24 h-24 rounded-3xl bg-white shadow-soft-md flex items-center justify-center text-surface-400">
                  <ContentTypeIcon type={content.type} className="w-12 h-12" />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className={typeBadge[content.type]}>
              <ContentTypeIcon type={content.type} className="w-3.5 h-3.5" />
              {content.type}
            </span>
            {content.category && (
              <span className="badge-gray">{content.category.name}</span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 tracking-tight">{content.title}</h1>
          <p className="text-surface-600 leading-relaxed">{content.description}</p>

          {content.previewContent && (
            <div className="card p-6 bg-gradient-to-br from-brand-50/50 to-purple-50/30 border-brand-100/50">
              <h3 className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-2">Preview</h3>
              <p className="text-surface-700 whitespace-pre-wrap leading-relaxed">{content.previewContent}</p>
            </div>
          )}

          {content.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {content.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-surface-100 text-surface-600 rounded-lg text-xs font-medium hover:bg-surface-200 transition-colors cursor-default">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Reviews */}
          <div className="pt-6">
            <h2 className="text-xl font-display font-bold text-surface-900 mb-6">
              Reviews ({content.reviewCount})
            </h2>

            {purchased && (
              <form onSubmit={handleSubmitReview} className="card p-5 mb-6 space-y-4">
                <h3 className="font-semibold text-sm text-surface-700">Write a Review</h3>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: star })}>
                      {star <= reviewForm.rating
                        ? <IconStar className="w-6 h-6 text-amber-400" />
                        : <IconStarOutline className="w-6 h-6 text-surface-300" />
                      }
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share your thoughts..."
                  className="input"
                  rows={3}
                />
                <button type="submit" disabled={submittingReview} className="btn-primary">
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}

            {reviews.length === 0 ? (
              <div className="card p-8 text-center">
                <IconStarOutline className="w-8 h-8 text-surface-300 mx-auto mb-2" />
                <p className="text-surface-500 text-sm">No reviews yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review: any) => (
                  <div key={review._id} className="card p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-purple-400 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{review.user?.name?.[0]?.toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-surface-800">{review.user?.name}</p>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <IconStar key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? "text-amber-400" : "text-surface-200"}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    {review.comment && <p className="text-sm text-surface-600 leading-relaxed">{review.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Purchase */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24 shadow-soft-lg">
            <div className="text-3xl font-display font-bold text-gradient mb-1">
              {formatPrice(content.price)}
            </div>

            <div className="flex items-center gap-4 text-sm text-surface-500 mb-6">
              {content.averageRating > 0 && (
                <span className="flex items-center gap-1">
                  <IconStar className="w-4 h-4 text-amber-400" />
                  <span className="font-medium text-surface-700">{content.averageRating.toFixed(1)}</span>
                </span>
              )}
              <span className="flex items-center gap-1">
                <IconEye className="w-4 h-4" />
                {content.viewCount}
              </span>
            </div>

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
                  className="w-full btn-primary py-3 text-base justify-center hero-gradient border-0"
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

            {content.creator && (
              <div className="mt-6 pt-6 border-t border-surface-100">
                <Link
                  href={`/creator-profile/${content.creator._id}`}
                  className="flex items-center gap-3 p-3 -mx-3 rounded-xl hover:bg-surface-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{content.creator.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-surface-900">{content.creator.name}</p>
                    <p className="text-xs text-surface-400">View profile</p>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
