"use client";

import { useState } from "react";
import { Bookmark } from "@/lib/bookmarks";
import { ExternalLink } from "lucide-react";

interface BookmarkGridProps {
  bookmarks: Bookmark[];
}

export default function BookmarkGrid({ bookmarks }: BookmarkGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (bookmarks.length === 0) {
    return (
      <p className="text-text-muted text-center text-[0.85rem]">
        nothing bookmarked yet. check back later.
      </p>
    );
  }

  const categories = [...new Set(bookmarks.map((b) => b.category))];

  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const items = bookmarks.filter((b) => b.category === category);
        return (
          <div key={category}>
            <h2 className="text-neon-lavender text-[0.8rem] font-bold uppercase tracking-widest mb-3">
              {category}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {items.map((bookmark) => {
                const globalIndex = bookmarks.indexOf(bookmark);
                const isActive = activeIndex === globalIndex;

                return (
                  <div
                    key={bookmark.title}
                    className="neon-card rounded-sm p-3 cursor-pointer relative overflow-hidden transition-all duration-200 hover:scale-[1.03]"
                    onClick={() =>
                      setActiveIndex(isActive ? null : globalIndex)
                    }
                    style={
                      isActive
                        ? {
                            boxShadow:
                              "0 0 20px #7b35cc66, 0 0 40px #cc44ff22",
                            borderColor: "var(--border-glow)",
                          }
                        : {
                            boxShadow: "0 0 12px #3d206044",
                            borderColor: "var(--border-color)",
                          }
                    }
                  >
                    <h3 className="text-text-primary text-[0.8rem] font-bold leading-tight">
                      {bookmark.title}
                    </h3>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {bookmark.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[0.6rem] text-neon-purple/70 border border-neon-purple/20 rounded-sm px-1.5 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div
                      className="overflow-hidden transition-all duration-200"
                      style={{
                        maxHeight: isActive ? "200px" : "0",
                        opacity: isActive ? 1 : 0,
                      }}
                    >
                      <p className="text-text-secondary text-[0.75rem] mt-2 leading-relaxed">
                        {bookmark.description}
                      </p>
                      <a
                        href={bookmark.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-neon-pink text-[0.75rem] mt-2 hover:glow-pink transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={12} />
                        visit
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
