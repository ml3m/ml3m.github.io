export interface Bookmark {
  title: string;
  description: string;
  href: string;
  tags: string[];
  category: string;
}

export const bookmarks: Bookmark[] = [];
