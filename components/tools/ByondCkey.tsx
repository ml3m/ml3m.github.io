"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

function convertKey(key: string): string {
  return key.toLowerCase().replace(/[^\da-z]/g, "").trim();
}

export default function ByondCkey() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  function convert() {
    const lines = input.split("\n").map((line) => convertKey(line));
    setOutput(lines.join("\n"));
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
        placeholder="Enter BYOND keys, one per line"
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
        placeholder="Converted ckeys"
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
