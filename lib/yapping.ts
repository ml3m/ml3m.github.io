export interface YappingPost {
  slug: string;
  title: string;
  date: string;
  summary: string;
  content: string;
}

export const posts: YappingPost[] = [
  {
    slug: "impulsive-thought-deleted-windows",
    title: "an impulsive thought that deleted windows",
    date: "2026-03-11",
    summary:
      "training a U-Net on an M1 mac at geological speed, remembering I own a gaming laptop, and accidentally switching to linux forever.",
    content: `## the aerial segmentation rabbit hole

I was deep into a university deep learning project: aerial image segmentation using [U-Net](https://arxiv.org/abs/1505.04597), trained on a chunk of the **ISPRS Potsdam dataset** sourced from [Kaggle](https://www.kaggle.com/datasets/deasadiqbal/private-data-1). About 2,000 training patches at 300×300 pixels each, labeled into six classes: roads, buildings, low vegetation, trees, cars, and clutter. Classic computer vision stuff.

After about 2 epochs on my M1 MacBook Air, the math was doing something I didn't appreciate: **32 minutes for 2 epochs**. A quick back-of-napkin calculation later, I was staring at a training timeline that was, diplomatically speaking, not feasible.

Then I remembered something. I own a **Zephyrus G14** gaming laptop, AMD GPU, sitting right next to my desk. Windows on it, used exclusively for gaming and absolutely nothing else. Zero data to lose, zero hesitation.

U-Net loves GPUs. So naturally, an idea formed.

---

## ROCm on AMD, it's complicated

Down the rabbit hole of running PyTorch on an AMD GPU: it requires **ROCm** instead of CUDA, which is already a bit niche, but fine. Still on Windows, I'm downloading things through PowerShell like I knew what I was doing... only to find that ROCm support on my specific model on Windows is essentially nonexistent.

However, on Linux there's a workaround documented in a GitHub issue that's been keeping AMD GPU users sane for a while: [ROCm/ROCm#1756](https://github.com/ROCm/ROCm/issues/1756)

That was the moment Windows' fate was sealed.

---

## the impulsive part

I reached for my USB stick without a second thought. The Windows install had literally just a browser and Steam with some games. Bootable drive, metal boot, done.

Now what flavor of Linux? I've been a chronic distrohopper before getting my Mac. Ubuntu, Fedora, Arch, PopOS, I've seen things. I wanted something opinionated this time. So I went with **[Omarchy](https://omarchy.org)**.

The install was almost suspiciously fast. Everything was just... there. Working. Out of the box. I genuinely couldn't believe how well-equipped this setup was from the start. Didn't expect that at all.

---

## training on GPU, the payoff

Cloned the [repo](https://github.com/ml3m/aerial-image-segmentation). Downloaded dependencies. Followed the ROCm issue. Set up the environment. Ran training.

**7-8x faster than the M1 Mac CPU.** That's it. That's the whole sentence. Going from "this is going to take geologically long" to "okay this is actually happening" was deeply satisfying in a way that's hard to overstate.

---

## tinkering while training

While the model was doing its thing, I wasn't just sitting there watching loss curves. I was poking around the new environment.

**Neovim**: the file tree isn't my personal preference, but fast and smooth and I genuinely can't complain. Coming from Packer on macOS, **Lazy** was a real upgrade. The update/install menu is slick, especially if you're familiar with Mason for LSPs, same energy, cleaner experience.

**Alacritty**: terminal. Well done. Nothing to add. Before Ghostty dethroned it as my daily driver, it was already my battle-tested main.

**Hyprland**: this one made me actually rethink how I work. Before the Mac (where I use Rectangle + Raycast keybinds for window management), I had been running i3 in an Arch VM on Windows 11. Hyprland on Wayland hits different. The tiling workflow is genuinely good and the animations don't feel like an overhead.

![The workspace: tmux, btop, neovim, chezmoi, and mlemfetch all at once](/img/yapping/omarchy-from-zero/setup.webp)

---

## making the G14 a proper Linux machine

Three days after training finished, I hadn't really touched the project. I was just... tinkering. Making the gaming laptop actually do its job on Linux.

First stop: [asus-linux.org](https://asus-linux.org/guides/arch-guide/). Turns out ASUS actually supports Linux for their ROG lineup. There's a custom kernel (\`linux-g14\`), fan control, LED control, and graphics switching all maintained by a community that clearly cares. Surprisingly solid support for a gaming laptop manufacturer.

The key pieces: **asusctl** for fan profiles and LED control, **power-profiles-daemon** for power management, and the **linux-g14** custom kernel. The whole setup process is well-documented and it just works. The \`uname -r\` output with \`-g14\` in it hits different.

---

## gaming on Linux, no, seriously

Steam installed. Games launched. And then I sat there wondering why I ever thought gaming required Windows.

Tested: **Baldur's Gate 3**, **Cult of the Lamb**, **Death Stranding**, **Hogwarts Legacy**, and in several of these, framerates were measurably *higher* on Linux than they had been on Windows. Not a placebo. Real numbers on the same hardware.

Credit where it's due: **[Valve's Proton](https://github.com/ValveSoftware/Proton)** is a genuine engineering achievement. And the **[ProtonDB](https://www.protondb.com)** community is invaluable, anytime something was acting weird, someone had already documented the exact launch options to fix it. The community really carries this.

I'm not going back. I was already doing everything productive on my Mac. Now gaming is covered away from Windows too. Goodbye, Microslop.

---

## the dotfiles, naturally

At some point during all this tinkering I integrated my macOS dotfiles into the new setup. The theme is warm and cozy, amber tones, soft glows, calm background. Lean into it.

I'm using **[Chezmoi](https://www.chezmoi.io)** to manage them. Cool project, handles machine-specific templating cleanly and makes syncing across installs not annoying at all.

The repo: [ml3m/dot](https://github.com/ml3m/dot)

![The vibe warm, cozy, and very much not Windows](/img/yapping/omarchy-from-zero/dotfiles.webp)

mlem`,
  },
  {
    slug: "hello-world",
    title: "hello world",
    date: "2026-02-21",
    summary:
      "the site is live. here's what it is and what i plan to do with it.",
    content: `so this is it. i finally got around to building a proper personal site instead of the usual empty github pages with a single line of text.

this place is built with next.js and tailwind, styled to look like something between a terminal and a neon sign. the whole thing is statically exported so it's just html/css/js sitting on a server somewhere.

what am i going to put here? mostly:

- **projects** -> stuff i build, whether it's a ray tracer in c++, a blockchain bridge, or a pygame game about a dude named brok. i have a lot of half-finished things and some actually finished ones.

- **interesting things** -> articles, tools, repos, papers, anything i stumble across that makes me go "huh, that's cool." the internet is full of gems buried under mountains of slop.

- **random thoughts** -> sometimes i have opinions about tech, algorithms, or why certain things are designed the way they are. this is where those go.

i don't have a schedule for posting. i'll write when i have something to say. if you're reading this, hi. hope you find something useful or at least mildly entertaining here.

- mlem`,
  },
];

export function getPost(slug: string): YappingPost | undefined {
  return posts.find((p) => p.slug === slug);
}
