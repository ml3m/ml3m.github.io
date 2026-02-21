"use client";

import { useState, useRef } from "react";

const PW_MAGIC = 0xa3;
const PW_FLAG = 0xff;

function decNextChar(bytes: number[]): [number, number[]] {
  if (bytes.length < 2) return [0, bytes];
  const a = bytes[0];
  const b = bytes[1];
  const next = ~(((a << 4) + b) ^ PW_MAGIC) & 0xff;
  return [next, bytes.slice(2)];
}

function decrypt(host: string, username: string, password: string): string {
  const key = username + host;
  const passbytes: number[] = [];
  for (let i = 0; i < password.length; i++) {
    const val = parseInt(password[i], 16);
    if (!isNaN(val)) passbytes.push(val);
  }

  const [flag, firstRest] = decNextChar(passbytes);
  let rest: number[];
  let length: number;

  if (flag === PW_FLAG) {
    [, rest] = decNextChar(firstRest);
    [length, rest] = decNextChar(rest);
  } else {
    length = flag;
    rest = firstRest;
  }

  const [toBeDeleted, afterDel] = decNextChar(rest);
  rest = afterDel;
  rest = rest.slice(toBeDeleted * 2);

  let clearpass = "";
  for (let i = 0; i < length; i++) {
    let val: number;
    [val, rest] = decNextChar(rest);
    clearpass += String.fromCharCode(val);
  }

  if (flag === PW_FLAG) {
    clearpass = clearpass.substring(key.length);
  }
  return clearpass;
}

function parseIniAndDecrypt(iniText: string): string {
  const lines = iniText.split(/\r?\n/);
  const sections: Record<string, Record<string, string>> = {};
  let currentSection: string | null = null;

  for (const line of lines) {
    if (line.startsWith("[")) {
      currentSection = line.slice(1, -1);
      sections[currentSection.toLowerCase()] = {};
    } else if (currentSection && line.includes("=")) {
      const [k, v] = line.split("=");
      sections[currentSection.toLowerCase()][k.trim().toLowerCase()] =
        v.trim();
    }
  }

  let output = "";
  for (const section in sections) {
    const data = sections[section];
    if ("password" in data) {
      const host = data["hostname"] || "";
      const user = data["username"] || "";
      const encrypted = data["password"] || "";
      const plain = decrypt(host, user, encrypted);
      output += `Session: ${section.replace(/^sessions\\/, "")}\n`;
      output += `  Hostname: ${host}\n`;
      output += `  Username: ${user}\n`;
      output += `  Password: ${plain}\n`;
      output += `========================\n`;
    }
  }

  return output || "No passwords found.";
}

export default function WinScpDecryptor() {
  const [host, setHost] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [singleOutput, setSingleOutput] = useState("");
  const [iniOutput, setIniOutput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function decryptSingle() {
    const result = decrypt(host, username, password);
    setSingleOutput(`Decrypted password: ${result}`);
  }

  function decryptIni() {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      alert("Please select an INI file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setIniOutput(parseIniAndDecrypt(text));
    };
    reader.readAsText(file);
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <p className="text-text-secondary text-[0.85rem] text-center">
        &quot;Decrypts&quot; passwords from WinSCP backups.{" "}
        <a
          href="https://github.com/anoopengineer/winscppasswd"
          target="_blank"
          rel="noopener noreferrer"
        >
          Converted to JS from this project
        </a>
      </p>

      <h2 className="text-neon-lavender text-sm font-bold">
        Decrypt Single Entry
      </h2>
      <input
        type="text"
        value={host}
        onChange={(e) => setHost(e.target.value)}
        placeholder="Host"
        className="neon-input w-full"
      />
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="neon-input w-full"
      />
      <input
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Encrypted Password"
        className="neon-input w-full"
      />
      <button
        onClick={decryptSingle}
        className="neon-input cursor-pointer hover:border-border-glow text-neon-lavender font-bold"
      >
        Decrypt
      </button>
      {singleOutput && (
        <pre className="neon-textarea w-full whitespace-pre-wrap text-[0.8rem] min-h-[2rem]">
          {singleOutput}
        </pre>
      )}

      <hr className="border-border-default w-full" />

      <h2 className="text-neon-lavender text-sm font-bold">Decrypt INI File</h2>
      <input
        ref={fileRef}
        type="file"
        accept=".ini"
        className="neon-input w-full"
      />
      <button
        onClick={decryptIni}
        className="neon-input cursor-pointer hover:border-border-glow text-neon-lavender font-bold"
      >
        Parse and Decrypt
      </button>
      {iniOutput && (
        <pre className="neon-textarea w-full whitespace-pre-wrap text-[0.8rem] min-h-[4rem]">
          {iniOutput}
        </pre>
      )}
    </div>
  );
}
