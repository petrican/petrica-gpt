"use client";

import { useState } from "react";

export default function StreamPage() {
  const [text, setText] = useState("");

  const start = async () => {
    const res = await fetch("/api/stream");
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      setText((prev) => prev + decoder.decode(value));
    }
  };

  return (
    <main style={{ padding: 24 }}>
      <h2>GPT sim</h2>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-1"
        onClick={start}
      >
        Start Streaming
      </button>
      <p>{text}</p>
    </main>
  );
}
