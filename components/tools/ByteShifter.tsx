"use client";

import { useState, useRef } from "react";

export default function ByteShifter() {
  const [shiftValues, setShiftValues] = useState<string[]>([""]);
  const [unshift, setUnshift] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function addShiftField() {
    setShiftValues([...shiftValues, ""]);
  }

  function updateShift(index: number, value: string) {
    const next = [...shiftValues];
    next[index] = value;
    setShiftValues(next);
  }

  function shiftBytes(input: ArrayBuffer, ...shiftBy: number[]): ArrayBuffer {
    const inputArray = new Uint8Array(input);
    const outputArray = new Uint8Array(inputArray.length);
    for (let i = 0; i < inputArray.length; i++) {
      outputArray[i] = inputArray[i] + shiftBy[i % shiftBy.length];
    }
    return outputArray.buffer;
  }

  function handleProcess() {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      alert("No file selected");
      return;
    }

    let shifts = shiftValues.map((v) => parseInt(v) || 0);
    if (unshift) {
      shifts = shifts.map((v) => -v);
    }

    const reader = new FileReader();
    reader.onload = () => {
      const output = shiftBytes(reader.result as ArrayBuffer, ...shifts);
      const blob = new Blob([output], { type: file.type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    };
    reader.readAsArrayBuffer(file);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <input
        ref={fileRef}
        type="file"
        className="neon-input w-full"
        onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
      />
      {fileName && (
        <p className="text-text-muted text-[0.8rem]">Selected: {fileName}</p>
      )}

      <p className="text-text-secondary text-[0.85rem] text-center">
        Bytes to shift by. Add more byte shifts to shift every other byte.
      </p>

      <label className="flex items-center gap-2 text-text-secondary text-[0.85rem]">
        <input
          type="checkbox"
          checked={unshift}
          onChange={(e) => setUnshift(e.target.checked)}
          className="accent-neon-purple"
        />
        Unshift
      </label>

      {shiftValues.map((val, i) => (
        <input
          key={i}
          type="number"
          value={val}
          onChange={(e) => updateShift(i, e.target.value)}
          placeholder={`Shift ${i + 1}`}
          className="neon-input w-32 text-center"
        />
      ))}

      <button
        onClick={addShiftField}
        className="neon-input cursor-pointer hover:border-border-glow text-text-secondary text-[0.8rem]"
      >
        Add byte shift
      </button>

      <button
        onClick={handleProcess}
        className="neon-input cursor-pointer hover:border-border-glow text-neon-lavender font-bold"
      >
        Shift bytes and Download
      </button>
    </div>
  );
}
