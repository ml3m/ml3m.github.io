export interface YappingPost {
  slug: string;
  title: string;
  date: string;
  summary: string;
  content: string;
}

export const posts: YappingPost[] = [
  {
    slug: "hello-world",
    title: "hello world",
    date: "2026-02-21",
    summary:
      "the site is live. here's what it is and what i plan to do with it.",
    content: `so this is it. i finally got around to building a proper personal site instead of the usual empty github pages with a single line of text.

this place is built with next.js and tailwind, styled to look like something between a terminal and a neon sign. the whole thing is statically exported so it's just html/css/js sitting on a server somewhere.

what am i going to put here? mostly:

- **projects** — stuff i build, whether it's a ray tracer in c++, a blockchain bridge, or a pygame game about a dude named brok. i have a lot of half-finished things and some actually finished ones.

- **interesting things** — articles, tools, repos, papers, anything i stumble across that makes me go "huh, that's cool." the internet is full of gems buried under mountains of slop.

- **random thoughts** — sometimes i have opinions about tech, algorithms, or why certain things are designed the way they are. this is where those go.

i don't have a schedule for posting. i'll write when i have something to say. if you're reading this, hi. hope you find something useful or at least mildly entertaining here.

— mlem`,
  },
];

export function getPost(slug: string): YappingPost | undefined {
  return posts.find((p) => p.slug === slug);
}
