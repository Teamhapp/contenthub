"use client";

import { useEffect, useState } from "react";
import ContentCard from "@/components/content/ContentCard";

export default function CreatorProfilePage({ params }: { params: { creatorId: string } }) {
  const [creator, setCreator] = useState<any>(null);
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/content?creator=${params.creatorId}&limit=50`).then((r) => r.json()),
    ])
      .then(([contentData]) => {
        setContents(contentData.contents || []);
        // Get creator info from first content
        if (contentData.contents?.length > 0) {
          setCreator(contentData.contents[0].creator);
        }
      })
      .finally(() => setLoading(false));
  }, [params.creatorId]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full" />
            <div>
              <div className="h-6 bg-gray-200 rounded w-48 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Creator Header */}
      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold overflow-hidden">
          {creator?.image ? (
            <img src={creator.image} alt="" className="w-full h-full object-cover" />
          ) : (
            creator?.name?.[0]?.toUpperCase() || "?"
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{creator?.name || "Creator"}</h1>
          <p className="text-gray-500">{contents.length} published items</p>
        </div>
      </div>

      {/* Content Grid */}
      {contents.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p>No published content yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contents.map((c) => (
            <ContentCard key={c._id} content={c} />
          ))}
        </div>
      )}
    </div>
  );
}
