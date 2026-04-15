import React, { useMemo, useState } from "react";

const AIwebBuilder = () => {
  const [prompt, setPrompt] = useState("");
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful coding assistant."
  );
  const [model, setModel] = useState("qwen/qwen3-coder-480b-a35b-instruct");
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.8);
  const [maxTokens, setMaxTokens] = useState(1024);

  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [usage, setUsage] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Idle");

  const canSubmit = useMemo(() => prompt.trim().length > 0 && !loading, [prompt, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setError("Please enter a prompt first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResponseText("");
      setUsage(null);
      setStatus("Sending request...");

      const res = await fetch("http://localhost:8000/api/ai/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          systemPrompt,
          model,
          temperature: Number(temperature),
          top_p: Number(topP),
          max_tokens: Number(maxTokens),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Something went wrong.");
      }

      setResponseText(data?.data?.output || "");
      setUsage(data?.data?.usage || null);
      setStatus("Success");
    } catch (err) {
      setError(err.message || "Failed to call API.");
      setStatus("Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFillSample = () => {
    setPrompt(
      "Create a responsive React hero section with heading, subheading, CTA buttons, and feature cards."
    );
  };

  const handleClear = () => {
    setPrompt("");
    setResponseText("");
    setUsage(null);
    setError("");
    setStatus("Idle");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">
            NVIDIA API Test Lab
          </h1>
          <p className="text-slate-400 mt-2">
            Test your NVIDIA OpenAI-compatible model from a clean UI.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left panel */}
          <div className="xl:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-xl font-semibold mb-4">Request Settings</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-slate-300">Model</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 outline-none"
                  placeholder="qwen/qwen3-coder-480b-a35b-instruct"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-slate-300">System Prompt</label>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 outline-none resize-none"
                  placeholder="You are a helpful assistant..."
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-slate-300">User Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={8}
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 outline-none resize-none"
                  placeholder="Write your prompt here..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-slate-300">Temperature</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-slate-300">Top P</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={topP}
                    onChange={(e) => setTopP(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 text-slate-300">Max Tokens</label>
                <input
                  type="number"
                  min="1"
                  max="4096"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 px-4 py-3 font-medium transition"
                >
                  {loading ? "Testing..." : "Run Test"}
                </button>

                <button
                  type="button"
                  onClick={handleFillSample}
                  className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-3 font-medium transition"
                >
                  Sample
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-3 font-medium transition"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>

          {/* Right panel */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h2 className="text-xl font-semibold">Response</h2>
                <span
                  className={`text-sm px-3 py-1 rounded-full border ${
                    status === "Success"
                      ? "border-green-500 text-green-400"
                      : status === "Failed"
                      ? "border-red-500 text-red-400"
                      : status === "Sending request..."
                      ? "border-yellow-500 text-yellow-400"
                      : "border-slate-700 text-slate-400"
                  }`}
                >
                  {status}
                </span>
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
                  {error}
                </div>
              )}

              <div className="rounded-xl bg-slate-950 border border-slate-800 min-h-[300px] p-4 whitespace-pre-wrap text-slate-200 overflow-auto">
                {responseText || "Model response will appear here..."}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h2 className="text-xl font-semibold mb-4">Usage / Debug Info</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl bg-slate-950 border border-slate-800 p-4">
                  <p className="text-slate-400 text-sm">Prompt Tokens</p>
                  <p className="text-2xl font-bold mt-2">
                    {usage?.prompt_tokens ?? "-"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950 border border-slate-800 p-4">
                  <p className="text-slate-400 text-sm">Completion Tokens</p>
                  <p className="text-2xl font-bold mt-2">
                    {usage?.completion_tokens ?? "-"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950 border border-slate-800 p-4">
                  <p className="text-slate-400 text-sm">Total Tokens</p>
                  <p className="text-2xl font-bold mt-2">
                    {usage?.total_tokens ?? "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h2 className="text-xl font-semibold mb-3">Notes</h2>
              <ul className="text-slate-300 space-y-2 list-disc pl-5">
                <li>Use backend proxy for security.</li>
                <li>Do not keep NVIDIA API key inside React component.</li>
                <li>Try changing either temperature or top_p, not both aggressively.</li>
                <li>Use smaller max_tokens for faster tests.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIwebBuilder;