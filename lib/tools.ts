export interface ToolDef {
  slug: string;
  title: string;
  description: string;
}

export const tools: ToolDef[] = [
  {
    slug: "byte-shifter",
    title: "Byte Shifter",
    description: "Shift bytes in a file by a certain amount",
  },
  {
    slug: "when-you",
    title: "When You Generator",
    description: "yep...",
  },
  {
    slug: "dip-switch",
    title: "8 Bit Dip Switch Calculator",
    description: "because it doesn't exist or i am just really stupid and blind.",
  },
  {
    slug: "redirection",
    title: "Redirection Tool",
    description:
      "Used for crafting links when you can't use the navigation bar. For example: the web browser on Google Hub display devices",
  },
  {
    slug: "byond-ckey",
    title: "BYOND Key to Ckey Converter",
    description: "Converts BYOND keys to ckeys",
  },
  {
    slug: "uwuify",
    title: "Fluffy Tongue Converter (uwuify)",
    description: "Miau miau miau meow meow mrrp mrrp :3 uwu",
  },
  {
    slug: "winscp-decrypt",
    title: "WinSCP Password Decryptor",
    description: "Decrypts passwords from WinSCP backups",
  },
  {
    slug: "doc-comment",
    title: "Doc Comment Converter",
    description:
      "Parses multiple non-doc comments and converts them to doc comments or doc code blocks",
  },
];
