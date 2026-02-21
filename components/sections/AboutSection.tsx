import NeonCard from "@/components/ui/NeonCard";

export default function AboutSection() {
  return (
    <div className="space-y-4">
      <NeonCard>
        <p className="max-w-[32em]">
          {/* TODO: replace with your real bio */}
          hiya, my name is m/3m. i have lots of hobbies, but the ones i&apos;m
          most passionate about are software engineering, tinkering with
          technology, and building things that probably nobody needs. this is my
          little website that i sometimes pour time into with random tools, dumb
          apis, and useless stuff nobody will ever need.
        </p>
        <hr className="border-border-default my-3" />
        <p className="text-text-secondary">
          {/* TODO: replace with your real role/company */}
          i&apos;m currently a software engineer working on things i find interesting.
        </p>
      </NeonCard>

      <NeonCard>
        <p className="max-w-[32em] text-text-secondary">
          i have not really updated this site in a while. i don&apos;t think
          i&apos;ll be redesigning it soon — i still add random tools to it
          though. if you&apos;re reading this and we used to talk: hi, i hope
          you&apos;re doing well. dm me if you feel like saying hi and catching
          up.
        </p>
      </NeonCard>
    </div>
  );
}
