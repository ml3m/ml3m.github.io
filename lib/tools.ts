export interface ToolDef {
  slug: string;
  title: string;
  description: string;
}

export const tools: ToolDef[] = [
  {
    slug: "byond-ckey",
    title: "BYOND Ckey Converter",
    description: "Convert BYOND usernames to ckeys.",
  },
  {
    slug: "byte-shifter",
    title: "Byte Shifter",
    description: "Shift bytes in a file by a specific amount.",
  },
  {
    slug: "dip-switch",
    title: "DIP Switch Calculator",
    description: "Calculate values from 8-bit DIP switches.",
  },
  {
    slug: "doc-comment",
    title: "Doc Comment Converter",
    description: "Convert standard comments to doc comments.",
  },
  {
    slug: "redirection",
    title: "Redirection Generator",
    description: "Generate URL redirection snippets.",
  },
  {
    slug: "uwuify",
    title: "Uwuifier",
    description: "Convert normal text to uwu speech.",
  },
  {
    slug: "when-you",
    title: "When You Generator",
    description: "Generate 'when you' meme text.",
  },
  {
    slug: "winscp-decrypt",
    title: "WinSCP Password Decryptor",
    description: "Decrypt WinSCP passwords from INI files.",
  }
];
