"use client";

import { useState } from "react";

const words = ["when", "you"];

function generateWhenYou(length: number): string {
  const extra: string[] = [];
  for (let i = 0; i < length - 2; i++) {
    extra.push(words[Math.floor(Math.random() * words.length)]);
  }
  return (words.join(" ") + " " + extra.join(" ")).trim();
}

export default function WhenYouGenerator() {
  const [amount, setAmount] = useState(5);
  const [result, setResult] = useState("");

  function generate() {
    setResult(generateWhenYou(Math.max(2, amount)));
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <label className="text-text-secondary text-[0.85rem]">How many?</label>
      <input
        type="number"
        min={2}
        value={amount}
        onChange={(e) => setAmount(parseInt(e.target.value) || 2)}
        className="neon-input w-24 text-center"
      />
      <button
        onClick={generate}
        className="neon-input cursor-pointer hover:border-border-glow text-neon-lavender font-bold"
      >
        Generate
      </button>
      {result && (
        <div className="neon-card rounded-sm p-3 max-w-lg text-center">
          <p className="text-text-primary">{result}</p>
        </div>
      )}
    </div>
  );
}
