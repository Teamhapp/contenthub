import Link from "next/link";
import { formatPrice } from "@/lib/constants";
import { ContentTypeIcon, IconStar, IconEye } from "@/components/ui/Icons";

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

const typeBadgeStyles: Record<string, string> = {
  article: "badge-blue",
  video: "badge-purple",
  file: "badge-green",
};

export default function ContentCard({ content }: ContentCardProps) {
  return (
    <Link href={`/browse/${content._id}`} className="group">
      <div className="card-hover overflow-hidden">
        {/* Thumbnail */}
        <div className="aspect-[16/10] bg-gradient-to-br from-surface-100 to-surface-50 relative overflow-hidden">
          {content.thumbnailUrl ? (
            <img
              src={content.thumbnailUrl}
              alt={content.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-white/80 shadow-soft-sm flex items-center justify-center text-surface-400">
                <ContentTypeIcon type={content.type} className="w-8 h-8" />
              </div>
            </div>
          )}
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* Badge */}
          <div className="absolute top-3 left-3">
            <span className={`${typeBadgeStyles[content.type] || "badge-gray"} backdrop-blur-sm`}>
              <ContentTypeIcon type={content.type} className="w-3.5 h-3.5" />
              {content.type}
            </span>
          </div>
          {/* Price tag */}
          <div className="absolute top-3 right-3">
            <span className="badge bg-white/90 backdrop-blur-sm text-surface-900 font-bold shadow-soft-sm border-0">
              {formatPrice(content.price)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display font-semibold text-surface-900 group-hover:text-brand-600 transition-colors line-clamp-1">
            {content.title}
          </h3>
          <p className="text-sm text-surface-500 mt-1.5 line-clamp-2 leading-relaxed">{content.description}</p>

          {/* Meta row */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-surface-100">
            {/* Creator */}
            {content.creator && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-400 to-purple-400 flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">{content.creator.name?.[0]?.toUpperCase()}</span>
                </div>
                <span className="text-xs text-surface-500 font-medium">{content.creator.name}</span>
              </div>
            )}
            {/* Stats */}
            <div className="flex items-center gap-3 text-xs text-surface-400">
              {content.averageRating > 0 && (
                <span className="flex items-center gap-1">
                  <IconStar className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-medium text-surface-600">{content.averageRating.toFixed(1)}</span>
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
