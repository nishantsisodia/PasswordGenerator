"use client";
import { useState, useEffect } from "react";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUM = "0123456789";
const SYM = "!@#$%^&*()-_=+[]{};:,.<>?";

function randomFrom(str) {
  return str[Math.floor(Math.random() * str.length)];
}

export default function PasswordGenerator({ onGenerated }) {
  const [length, setLength] = useState(16);
  const [useLower, setUseLower] = useState(true);
  const [useUpper, setUseUpper] = useState(true);
  const [useNum, setUseNum] = useState(true);
  const [useSym, setUseSym] = useState(false);
  const [pwd, setPwd] = useState("");
  const [copied, setCopied] = useState(false);

  function generate() {
    let pool = "";
    if (useLower) pool += LOWER;
    if (useUpper) pool += UPPER;
    if (useNum) pool += NUM;
    if (useSym) pool += SYM;
    if (!pool) return setPwd("");
    let out = "";
    for (let i = 0; i < length; i++) out += randomFrom(pool);
    setPwd(out);
    if (onGenerated) onGenerated(out);
  }

  useEffect(() => {
    generate();
  }, []);

  async function copy() {
    if (!pwd) return;
    await navigator.clipboard.writeText(pwd);
    setCopied(true);
    setTimeout(() => setCopied(false), 15000);
  }

  return (
    <div className="card">
      <h2>Password Generator</h2>
      <div className="row">
        <label>Length: {length}</label>
        <input
          type="range"
          min="6"
          max="64"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
        />
      </div>
      <div className="opts">
        <label>
          <input
            type="checkbox"
            checked={useLower}
            onChange={(e) => setUseLower(e.target.checked)}
          />{" "}
          lower
        </label>
        <label>
          <input
            type="checkbox"
            checked={useUpper}
            onChange={(e) => setUseUpper(e.target.checked)}
          />{" "}
          UPPER
        </label>
        <label>
          <input
            type="checkbox"
            checked={useNum}
            onChange={(e) => setUseNum(e.target.checked)}
          />{" "}
          numbers
        </label>
        <label>
          <input
            type="checkbox"
            checked={useSym}
            onChange={(e) => setUseSym(e.target.checked)}
          />{" "}
          symbols
        </label>
      </div>
      <div className="output">
        <input readOnly value={pwd} />
        <div className="buttons">
          <button onClick={generate}>Generate</button>
          <button onClick={copy}>
            {copied ? "Copied (auto-clear in 15s)" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
