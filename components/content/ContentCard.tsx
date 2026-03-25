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

const typeLabels: Record<string, { label: string; bg: string }> = {
  article: { label: "ARTICLE", bg: "bg-[#451ebb]" },
  video: { label: "VIDEO", bg: "bg-[#5d3fd3]" },
  file: { label: "FILE", bg: "bg-[#605693]" },
};

export default function ContentCard({ content }: ContentCardProps) {
  const typeInfo = typeLabels[content.type] || { label: content.type.toUpperCase(), bg: "bg-[#484554]" };

  return (
    <Link href={`/browse/${content._id}`} className="group">
      <div className="bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_rgba(21,27,41,0.08)] hover:-translate-y-1 border border-[#e2e8fc]/30">
        {/* Thumbnail */}
        <div className="aspect-[16/10] bg-[#f1f3ff] relative overflow-hidden">
          {content.thumbnailUrl ? (
            <img
              src={content.thumbnailUrl}
              alt={content.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#e9edff] to-[#f1f3ff]">
              <div className="w-16 h-16 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#c9c4d7]">
                <ContentTypeIcon type={content.type} className="w-8 h-8" />
              </div>
            </div>
          )}

          {/* Type badge */}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex px-2.5 py-1 rounded text-[9px] font-bold tracking-[0.08em] text-white ${typeInfo.bg}`}>
              {typeInfo.label}
            </span>
          </div>

          {/* Wishlist */}
          <div className="absolute top-3 right-3">
            <WishlistButton contentId={content._id} size="sm" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Creator */}
          {content.creator && (
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#451ebb] to-[#5d3fd3] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[9px] font-bold">{content.creator.name?.[0]?.toUpperCase()}</span>
              </div>
              <span className="text-xs text-[#484554] font-medium">{content.creator.name}</span>
            </div>
          )}

          <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[#151b29] group-hover:text-[#451ebb] transition-colors line-clamp-1 text-base">
            {content.title}
          </h3>

          {/* Rating */}
          {content.averageRating > 0 && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <IconStar className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-semibold text-[#151b29]">{content.averageRating.toFixed(1)}</span>
              <span className="text-xs text-[#797586]">({content.totalSales} reviews)</span>
            </div>
          )}

          {/* Price row */}
          <div className="flex items-center justify-between mt-4">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-[#151b29] text-lg">
              {content.price === 0 ? "FREE" : formatPrice(content.price)}
            </span>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-lg bg-[#f1f3ff] flex items-center justify-center hover:bg-[#e6deff] transition-colors">
                <span className="material-symbols-outlined text-[#451ebb] text-base">bolt</span>
              </button>
              <button className="w-8 h-8 rounded-lg bg-[#f1f3ff] flex items-center justify-center hover:bg-[#e6deff] transition-colors">
                <span className="material-symbols-outlined text-[#451ebb] text-base">add_shopping_cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
