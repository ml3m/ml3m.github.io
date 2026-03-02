"use client";

import { Bookmark } from "@/lib/bookmarks";
import Bookmark3DCard from "@/components/ui/Bookmark3DCard";

interface BookmarkGridProps {
  bookmarks: Bookmark[];
  asList?: boolean;
}

export default function BookmarkGrid({ bookmarks, asList = false }: BookmarkGridProps) {
  if (bookmarks.length === 0) {
    return (
      <p className="text-text-muted text-center text-[0.85rem]">
        nothing bookmarked yet. check back later.
      </p>
    );
  }

  const categories = [...new Set(bookmarks.map((b) => b.category))];

  return (
    <div className="space-y-12">
      {categories.map((category) => {
        const items = bookmarks.filter((b) => b.category === category);
        return (
          <div key={category}>
            <h2 className="text-neon-lavender text-[0.8rem] font-bold uppercase tracking-widest mb-6 border-b border-border-default pb-2">
              {category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 auto-rows-[320px]">
              {items.map((bookmark) => (
                <div key={bookmark.title} className="w-full h-full flex justify-center items-center">
                  <Bookmark3DCard bookmark={bookmark} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
