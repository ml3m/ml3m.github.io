import { Metadata } from "next";
import GlowText from "@/components/ui/GlowText";
import BookmarkGrid from "@/components/bookmarks/BookmarkGrid";
import { bookmarks } from "@/lib/bookmarks";

export const metadata: Metadata = { title: "Bookmarks" };

export default function BookmarksPage() {
  return (
    <div className="max-w-[680px] mx-auto px-4 py-6 space-y-4">
      <GlowText as="h1" color="pink" className="text-xl font-bold text-center">
        Bookmarks
      </GlowText>
      <p className="text-text-secondary text-center text-[0.85rem]">
        things i found on the internet that i thought were cool enough to save.
      </p>

      <BookmarkGrid bookmarks={bookmarks} />
    </div>
  );
}
