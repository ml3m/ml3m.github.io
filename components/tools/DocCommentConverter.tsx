"use client";

import { useState, useEffect } from "react";
import { Copy } from "lucide-react";

const defaultInput = `// two lines
// two lines

// one line

  // three lines with whitespace!!
  // three lines with whitespace!!
  // three lines with whitespace!!

/*
  this is not a proper doc comment!
  meow!
*/

var/list/meowmeow = list("meow", "meow") // this is a comment on the same line as this var declaration`;

function convertLines(input: string): string {
  const lines = input.split("\n");
  let result = "";
  let block: string[] = [];
  let lastWasComment = false;

  function flushBlock() {
    if (block.length === 1) {
      const match = block[0].match(/^(\s*)\/\//);
      const ws = match ? match[1] : "";
      const content = block[0].replace(/^(\s*\/\/)/, "").trim();
      result += ws + "/// " + content + "\n";
    } else if (block.length > 1) {
      const match = block[0].match(/^(\s*)\/\//);
      const ws = match ? match[1] : "";
      result += ws + "/**\n";
      block.forEach((line) => {
        const content = line.replace(/^(\s*\/\/)/, "").trim();
        result += ws + " * " + content + "\n";
      });
      result += ws + " */\n";
    }
    block = [];
  }

  let inBlockComment = false;
  let blockCommentLines: string[] = [];
  let blockCommentIndent = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!inBlockComment && /^\s*\/\*/.test(line)) {
      inBlockComment = true;
      blockCommentLines = [];
      const match = line.match(/^(\s*)\/\*/);
      blockCommentIndent = match ? match[1] : "";
      const content = line
        .replace(/^(\s*)\/\*/, "")
        .replace(/\*\/\s*$/, "")
        .trim();
      if (content) blockCommentLines.push(content);
      continue;
    }

    if (inBlockComment) {
      if (/\*\//.test(line)) {
        const content = line
          .replace(/\*\/\s*$/, "")
          .replace(/^\s*\*/, "")
          .trim();
        if (content) blockCommentLines.push(content);
        result += blockCommentIndent + "/**\n";
        blockCommentLines.forEach((l) => {
          result += blockCommentIndent + " * " + l + "\n";
        });
        result += blockCommentIndent + " */\n";
        inBlockComment = false;
        blockCommentLines = [];
        blockCommentIndent = "";
        continue;
      } else {
        const content = line.replace(/^\s*\*/, "").trim();
        if (content) blockCommentLines.push(content);
        continue;
      }
    }

    const inlineMatch = line.match(/^(\s*)(.*?)(\s*\/\/\s*(.*))$/);
    if (inlineMatch && inlineMatch[2].trim() !== "") {
      const ws = inlineMatch[1];
      const codePart = inlineMatch[2].trimEnd();
      const commentContent = inlineMatch[4].trim();
      result +=
        ws +
        "/// " +
        commentContent.charAt(0).toUpperCase() +
        commentContent.slice(1) +
        "\n";
      result += ws + codePart + "\n";
      lastWasComment = false;
      continue;
    }

    if (/^\s*\/\//.test(line)) {
      block.push(line);
      lastWasComment = true;
    } else {
      if (block.length) flushBlock();
      result += line + "\n";
      lastWasComment = false;
    }

    if (
      lastWasComment &&
      i + 1 < lines.length &&
      !/^\s*\/\//.test(lines[i + 1]) &&
      lines[i + 1].trim() === ""
    ) {
      result += "\n";
    }
  }
  if (block.length) flushBlock();
  return result.trimEnd();
}

export default function DocCommentConverter() {
  const [input, setInput] = useState(defaultInput);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOutput(convertLines(input));
  }, [input]);

  function copyToClipboard() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <p className="text-text-secondary text-[0.85rem] text-center">
        Converts comments to documentation comments. One line makes a singleline
        doc comment, consecutive lines become a block doc comment.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="neon-textarea w-full h-64 text-[0.8rem]"
        spellCheck={false}
      />

      <textarea
        value={output}
        readOnly
        className="neon-textarea w-full h-64 text-[0.8rem]"
        spellCheck={false}
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
