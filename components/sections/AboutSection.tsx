import NeonCard from "@/components/ui/NeonCard";

export default function AboutSection() {
  return (
    <div className="space-y-4">
      <NeonCard>
        <p className="max-w-[32em]">
          hiya, my name is mlem or ml3m or ml3ml3m or w13m13wml3m2lmlememelelmelm or whatever. i have lots of hobbies, but the ones i&apos;m
          most passionate about are software engineering, tinkering with
          technology, and building things that probably nobody needs. this is my
          little website that i sometimes pour time into with random tools, dumb
          apis, and useless stuff nobody will ever need.
        </p>
        <hr className="border-border-default my-3" />
        <p className="max-w-[50em] text-text-secondary">
          i&apos;m currently a cse student at tu/e,
          messing around with algorithms, systems programming, and whatever
          catches my eye.
        </p>
      </NeonCard>

      <NeonCard>
        <p className="max-w-[50em] text-text-secondary">
          this site is freshly built. i&apos;ll be using it to talk about
          projects i&apos;m working on, interesting things i find on the
          internet — tech related or otherwise. if you&apos;re reading this and
          we know each other: hi, i hope you&apos;re doing well. dm me if you
          feel like catching up.
        </p>
      </NeonCard>

      <NeonCard>
        <p className="max-w-[50em] text-text-secondary">
          play with the neon kitty, double click it to wake it up!
        </p>
      </NeonCard>
    </div>
  );
}
