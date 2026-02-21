"use client";

import { useState } from "react";

const quickLinks = [
  "https://www.whatismybrowser.com/",
  "https://www.google.com/",
  "https://www.duckduckgo.com/",
  "https://www.youtube.com/",
  "https://canary.discord.com/",
  "https://archive.org/",
];

export default function RedirectionTool() {
  const [url, setUrl] = useState("");
  const [target, setTarget] = useState("_self");
  const [outputUrl, setOutputUrl] = useState("");
  const [error, setError] = useState("");

  function createLink() {
    try {
      const parsed = new URL(url);
      setOutputUrl(parsed.toString());
      setError("");
    } catch {
      setOutputUrl("");
      setError("Invalid URL");
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <p className="text-text-secondary text-[0.85rem] text-center">
        Typical uses: browsers that don&apos;t have an address bar, such as the
        browser built into Google Display devices, or you&apos;re on a
        locked-down device but able to access this page.
      </p>

      <div className="flex flex-col gap-2 w-full max-w-sm">
        <label className="text-text-muted text-[0.8rem]">Valid URL</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="neon-input w-full"
        />
      </div>

      <div className="flex flex-col gap-2 w-full max-w-sm">
        <label className="text-text-muted text-[0.8rem]">Target</label>
        <select
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="neon-select w-full"
        >
          <option value="_self">_self (default)</option>
          <option value="_blank">_blank</option>
          <option value="_parent">_parent</option>
          <option value="_top">_top</option>
        </select>
      </div>

      <button
        onClick={createLink}
        className="neon-input cursor-pointer hover:border-border-glow text-neon-lavender font-bold"
      >
        Create
      </button>

      {error && <p className="text-neon-pink text-[0.85rem]">{error}</p>}
      {outputUrl && (
        <p className="text-[0.85rem]">
          Output url:{" "}
          <a href={outputUrl} target={target}>
            {outputUrl}
          </a>
        </p>
      )}

      <hr className="border-border-default w-full" />

      <h2 className="text-neon-lavender text-sm font-bold">
        Quick/Common Links
      </h2>
      <div className="flex flex-col items-center gap-1">
        {quickLinks.map((link) => (
          <a key={link} href={link} target="_blank" rel="noopener noreferrer">
            {link}
          </a>
        ))}
      </div>
    </div>
  );
}
