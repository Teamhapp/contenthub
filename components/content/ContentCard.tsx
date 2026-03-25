import Link from "next/link";
import { formatPrice } from "@/lib/constants";
import { ContentTypeIcon, IconStar, IconEye } from "@/components/ui/Icons";
import WishlistButton from "@/components/ui/WishlistButton";

interface ContentCardProps {
  content: {
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
  };
}

const typeColors: Record<string, { badge: string; glow: string }> = {
  article: { badge: "bg-blue-500/90 text-white", glow: "shadow-[0_2px_8px_rgb(59_130_246/0.3)]" },
  video: { badge: "bg-purple-500/90 text-white", glow: "shadow-[0_2px_8px_rgb(139_92_246/0.3)]" },
  file: { badge: "bg-emerald-500/90 text-white", glow: "shadow-[0_2px_8px_rgb(16_185_129/0.3)]" },
};

export default function ContentCard({ content }: ContentCardProps) {
  const colors = typeColors[content.type] || { badge: "bg-surface-600/90 text-white", glow: "" };

  return (
    <Link href={`/browse/${content._id}`} className="group">
      <div className="card overflow-hidden transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1.5 hover:border-surface-200">
        {/* Thumbnail */}
        <div className="aspect-[16/10] bg-gradient-to-br from-surface-100 to-surface-50 relative overflow-hidden">
          {content.thumbnailUrl ? (
            <img
              src={content.thumbnailUrl}
              alt={content.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-50 via-white to-surface-100">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-soft-md flex items-center justify-center text-surface-300 group-hover:scale-110 transition-transform duration-300">
                <ContentTypeIcon type={content.type} className="w-8 h-8" />
              </div>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Type badge */}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold backdrop-blur-md ${colors.badge} ${colors.glow}`}>
              <ContentTypeIcon type={content.type} className="w-3 h-3" />
              {content.type}
            </span>
          </div>

          {/* Wishlist + Price */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <WishlistButton contentId={content._id} size="sm" />
            <span className="price-tag text-xs">
              {formatPrice(content.price)}
            </span>
          </div>

          {/* Hover CTA */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <span className="inline-flex items-center gap-1.5 text-sm text-white font-semibold">
              View Details
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display font-bold text-surface-900 group-hover:text-brand-600 transition-colors line-clamp-1 text-[15px]">
            {content.title}
          </h3>
          <p className="text-sm text-surface-500 mt-1.5 line-clamp-2 leading-relaxed">{content.description}</p>

          {/* Meta row */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-surface-100/80">
            {/* Creator */}
            {content.creator && (
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[9px] font-bold">{content.creator.name?.[0]?.toUpperCase()}</span>
                </div>
                <span className="text-xs text-surface-500 font-medium truncate">{content.creator.name}</span>
              </div>
            )}
            {/* Stats */}
            <div className="flex items-center gap-3 text-xs text-surface-400 flex-shrink-0">
              {content.averageRating > 0 && (
                <span className="flex items-center gap-1">
                  <IconStar className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold text-surface-600">{content.averageRating.toFixed(1)}</span>
                </span>
              )}
              <span className="flex items-center gap-1">
                <IconEye className="w-3.5 h-3.5" />
                {content.totalSales}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
