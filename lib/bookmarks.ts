export interface Bookmark {
  title: string;
  description: string;
  href: string;
  tags: string[];
  category: string;
  type: "Tool" | "Repository" | "Website" | "Article";
  stats?: { label: string; value: string }[];
  accent?: "pink" | "purple" | "lavender" | "magenta";
}

export const bookmarks: Bookmark[] = [
  {
    title: "Oh My Zsh",
    description: "A delightful, open source, community-driven framework for managing your Zsh configuration. It comes bundled with thousands of helpful functions, helpers, plugins, themes.",
    href: "https://github.com/ohmyzsh/ohmyzsh",
    tags: ["Zsh", "Terminal", "Framework"],
    category: "Terminal",
    type: "Repository",
    stats: [{ label: "Stars", value: "172k" }],
    accent: "pink"
  },
  {
    title: "Ghostty",
    description: "Ghostty is a modern, fast, and feature-rich terminal emulator built to be a joy to use. Designed to be lightweight and responsive.",
    href: "https://github.com/ghostty-org/ghostty",
    tags: ["Terminal", "Emulator", "C"],
    category: "Terminal",
    type: "Repository",
    stats: [{ label: "Stars", value: "31k" }],
    accent: "purple"
  },
  {
    title: "Zsh Autosuggestions",
    description: "Fish-like autosuggestions for Zsh. Suggests commands as you type based on history and completions.",
    href: "https://github.com/zsh-users/zsh-autosuggestions",
    tags: ["Zsh", "Plugin", "Productivity"],
    category: "Terminal",
    type: "Repository",
    stats: [{ label: "Stars", value: "29k" }],
    accent: "lavender"
  },
  {
    title: "Zen Browser",
    description: "A fast, beautiful, and privacy-focused browser built for the modern web.",
    href: "https://zen-browser.app/",
    tags: ["Browser", "Privacy", "Fast"],
    category: "Browsers",
    type: "Website",
    accent: "pink"
  },
  {
    title: "Undotree",
    description: "The ultimate undo history visualizer for Vim. See your undo history as a branching tree, easily navigate between states.",
    href: "https://github.com/mbbill/undotree",
    tags: ["Vim", "Plugin", "History"],
    category: "Editors",
    type: "Repository",
    stats: [{ label: "Stars", value: "4k" }],
    accent: "lavender"
  },
  {
    title: "Pylint",
    description: "Pylint is a static code analyser for Python. It analyses your code without actually running it and checks for errors, enforces a coding standard.",
    href: "https://github.com/pylint-dev/pylint",
    tags: ["Python", "Linter", "Static Analysis"],
    category: "Tools",
    type: "Repository",
    stats: [{ label: "Stars", value: "5.5k" }],
    accent: "purple"
  },
  {
    title: "Dua CLI",
    description: "A tool to conveniently learn about the disk usage of directories, fast! View disk space usage interactively.",
    href: "https://github.com/Byron/dua-cli",
    tags: ["Rust", "CLI", "Disk Management"],
    category: "Tools",
    type: "Repository",
    stats: [{ label: "Stars", value: "4k" }],
    accent: "magenta"
  },
  {
    title: "Mason LSPConfig",
    description: "Complete bridge between mason.nvim and nvim-lspconfig. Makes it easy to set up language servers installed with mason.",
    href: "https://github.com/williamboman/mason-lspconfig.nvim",
    tags: ["Neovim", "LSP", "Plugin"],
    category: "Editors",
    type: "Repository",
    stats: [{ label: "Stars", value: "2.3k" }],
    accent: "pink"
  },
  {
    title: "Rosé Pine",
    description: "All natural pine, faux fur and a bit of soho vibes for the classy minimalist. A theme for Neovim and other tools.",
    href: "https://github.com/rose-pine/rose-pine-theme",
    tags: ["Theme", "Design", "Aesthetics"],
    category: "Customization",
    type: "Repository",
    stats: [{ label: "Stars", value: "10k" }],
    accent: "magenta"
  },
  {
    title: "Tmux Sessionizer",
    description: "Quickly switch between tmux sessions across all your projects. A must-have tool for heavy tmux users.",
    href: "https://github.com/ThePrimeagen/tmux-session",
    tags: ["Tmux", "Script", "Productivity"],
    category: "Tools",
    type: "Repository",
    accent: "pink"
  }
];
