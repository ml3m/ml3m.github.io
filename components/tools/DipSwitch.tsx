"use client";

import { useState } from "react";

const BITS = [128, 64, 32, 16, 8, 4, 2, 1];

export default function DipSwitch() {
  const [switches, setSwitches] = useState<boolean[]>(new Array(8).fill(false));

  const decimalValue = switches.reduce(
    (acc, on, i) => acc + (on ? BITS[i] : 0),
    0
  );
  const binaryValue = switches.map((on) => (on ? "1" : "0")).join("");

  function toggle(index: number) {
    const next = [...switches];
    next[index] = !next[index];
    setSwitches(next);
  }

  function setFromDecimal(val: number) {
    const clamped = Math.max(0, Math.min(255, val));
    const next = BITS.map((bit) => (clamped & bit) !== 0);
    setSwitches(next);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center">
        <h2 className="text-lg text-neon-lavender">
          Value: <span className="text-neon-pink glow-pink">{decimalValue}</span>
        </h2>
        <h3 className="text-sm text-text-secondary">
          Binary: <span className="text-neon-purple">{binaryValue}</span>
        </h3>
      </div>

      <div className="flex gap-2 items-end">
        {BITS.map((bit, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <button
              onClick={() => toggle(i)}
              className={`w-9 h-14 rounded-sm border transition-all cursor-pointer flex items-center justify-center ${
                switches[i]
                  ? "bg-neon-purple/30 border-neon-purple shadow-[0_0_10px_#cc44ff44]"
                  : "bg-bg-card border-border-default"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-sm transition-all ${
                  switches[i] ? "bg-neon-purple translate-y-[-8px]" : "bg-text-muted translate-y-[8px]"
                }`}
              />
            </button>
            <span className="text-[0.7rem] text-text-muted">{bit}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <label className="text-text-secondary text-[0.85rem]">Set decimal:</label>
        <input
          type="number"
          min={0}
          max={255}
          value={decimalValue}
          onChange={(e) => setFromDecimal(parseInt(e.target.value) || 0)}
          className="neon-input w-20 text-center"
        />
      </div>
    </div>
  );
}
