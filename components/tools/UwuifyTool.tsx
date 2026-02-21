"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

const uwuifyMapping = new Map([
  ["ove", "uv"],
  ["ne", "nye"],
  ["nu", "nyu"],
  ["na", "nya"],
  ["no", "nyo"],
  ["r", "w"],
  ["l", "w"],
]);

const uwuifyRegex = new RegExp(
  [...uwuifyMapping.keys()]
    .map((str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|"),
  "gi"
);

function matchCase(original: string, replacement: string): string {
  if (original === original.toUpperCase()) return replacement.toUpperCase();
  if (original[0] === original[0].toUpperCase())
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  return replacement;
}

function uwuifyText(text: string): string {
  return text.replace(uwuifyRegex, (match) =>
    matchCase(match, uwuifyMapping.get(match.toLowerCase()) || match)
  );
}

export default function UwuifyTool() {
  const [input, setInput] = useState("hello world! I'm a cute cat girl nya!");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  function convert() {
    setOutput(uwuifyText(input));
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text to uwuify"
        className="neon-textarea w-full h-48"
      />

      <button
        onClick={convert}
        className="neon-input cursor-pointer hover:border-border-glow text-neon-lavender font-bold"
      >
        Convert
      </button>

      <textarea
        value={output}
        readOnly
        placeholder="Converted text"
        className="neon-textarea w-full h-48"
      />

      <button
        onClick={copyToClipboard}
        className="neon-input cursor-pointer hover:border-border-glow text-text-secondary flex items-center gap-2"
      >
        <Copy size={14} />
        {copied ? "Copied!" : "Copy to Clipboard"}
      </button>
    </div>
  );
}
