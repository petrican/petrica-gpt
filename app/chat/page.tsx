"use client";

import { useState } from "react";

export default function StreamPage() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    setOutput("");
    setPrompt("");

    const res = await fetch("/api/llm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      setLoading(false);
      return;
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      setOutput((prev) => prev + decoder.decode(value, { stream: true }));
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold">Access local model</h1>

        <textarea
          className="w-full rounded-xl border p-4"
          placeholder="Write something..."
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          onClick={run}
          disabled={loading}
          className="rounded-xl bg-black px-5 py-3 text-white transition active:scale-95 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Send"}
        </button>

        <div className="whitespace-pre-wrap rounded-xl border p-4">
          {output}
        </div>
      </div>
    </main>
  );
}
