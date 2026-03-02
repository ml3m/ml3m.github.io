"use client";

import { useState } from "react";
import { Bookmark } from "@/lib/bookmarks";
import BookmarkGrid from "./BookmarkGrid";
import BookmarkBookshelf from "@/components/ui/BookmarkBookshelf";
import { LayoutGrid, Library, Component } from "lucide-react";

interface BookmarksViewManagerProps {
    bookmarks: Bookmark[];
}

export default function BookmarksViewManager({ bookmarks }: BookmarksViewManagerProps) {
    const [view, setView] = useState<"deck" | "bookshelf" | "list">("deck");

    // A subtle toggle UI matching the neon styles
    return (
        <div className="space-y-8">
            {/* View Toggle */}
            <div className="flex justify-center mb-8">
                <div className="inline-flex p-1 bg-bg-card border border-border-default rounded-sm gap-1 neon-card">
                    <button
                        onClick={() => setView("deck")}
                        className={`flex items-center gap-2 px-4 py-2 text-[0.75rem] font-bold uppercase tracking-widest transition-all rounded-sm ${view === "deck"
                            ? "bg-neon-pink/20 text-neon-pink shadow-[0_0_10px_#ff4da644] border border-neon-pink/30"
                            : "text-text-muted hover:text-text-secondary border border-transparent"
                            }`}
                    >
                        <Component size={14} /> Deck
                    </button>
                    <button
                        onClick={() => setView("bookshelf")}
                        className={`flex items-center gap-2 px-4 py-2 text-[0.75rem] font-bold uppercase tracking-widest transition-all rounded-sm ${view === "bookshelf"
                            ? "bg-neon-purple/20 text-neon-purple shadow-[0_0_10px_#cc44ff44] border border-neon-purple/30"
                            : "text-text-muted hover:text-text-secondary border border-transparent"
                            }`}
                    >
                        <Library size={14} /> Shelf
                    </button>
                    <button
                        onClick={() => setView("list")}
                        className={`flex items-center gap-2 px-4 py-2 text-[0.75rem] font-bold uppercase tracking-widest transition-all rounded-sm ${view === "list"
                            ? "bg-neon-lavender/20 text-neon-lavender shadow-[0_0_10px_#c77dff44] border border-neon-lavender/30"
                            : "text-text-muted hover:text-text-secondary border border-transparent"
                            }`}
                    >
                        <LayoutGrid size={14} /> List
                    </button>
                </div>
            </div>

            {/* Render Component */}
            <div className="min-h-[500px] transition-all duration-500">
                {view === "deck" && <BookmarkGrid bookmarks={bookmarks} asList={false} />}
                {view === "list" && <BookmarkGrid bookmarks={bookmarks} asList={true} />}
                {view === "bookshelf" && <BookmarkBookshelf bookmarks={bookmarks} />}
            </div>
        </div>
    );
}
