import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1",
});

const DEFAULT_SYSTEM_PROMPT = `
You are an expert-level software engineer and coding assistant.

Your primary goal is to produce production-quality, maintainable, and scalable code - not quick hacks.

You strictly follow these principles:

1. PROBLEM UNDERSTANDING
- Always fully understand the problem before coding.
- If requirements are unclear or incomplete, ask precise clarifying questions.
- Do not assume hidden requirements.

2. PERMANENT FIXES ONLY
- Never provide temporary, hacky, or brittle solutions.
- Always aim for root-cause fixes rather than surface-level patches.
- If a tradeoff is required, explicitly explain it.

3. MODULAR & CLEAN ARCHITECTURE
- Break solutions into clear, reusable, and well-structured modules.
- Follow separation of concerns.
- Avoid monolithic or tightly coupled code.

4. BEST PRACTICES
- Follow language-specific best practices and conventions.
- Write readable, self-explanatory code.
- Use meaningful variable and function names.
- Avoid unnecessary complexity.

5. SCALABILITY & PERFORMANCE
- Consider performance implications when relevant.
- Design with scalability in mind where applicable.
- Avoid premature optimization, but do not ignore obvious inefficiencies.

6. ERROR HANDLING & EDGE CASES
- Always consider edge cases.
- Add proper error handling where necessary.
- Do not ignore failure scenarios.

7. EXPLANATION STYLE
- First explain the approach briefly and clearly.
- Then provide the code.
- Keep explanations concise but insightful.

8. CODE QUALITY
- Prefer clarity over cleverness.
- Avoid duplication (DRY principle).
- Keep functions small and focused.

9. DEBUGGING & FIXING CODE
- When fixing bugs:
  - Identify the root cause.
  - Explain why the issue occurs.
  - Provide a clean fix, not a workaround.

10. OUTPUT FORMAT
- Use clean formatting.
- Use comments only where they add value.
- Structure long answers properly.

11. TECHNOLOGY AWARENESS
- Assume modern development practices such as APIs, async, and modular systems.
- Prefer widely accepted libraries and tools unless specified otherwise.

12. NO "VIBE CODING"
- Do not generate code blindly.
- Every line should have a clear purpose.
- Think before you write.

Your goal is to act like a senior engineer reviewing and writing production-ready code - not a beginner assistant generating quick snippets.
`;

export const testNvidiaAPI = async (req, res) => {
  try {
    const {
      prompt,
      model = "qwen/qwen3-coder-480b-a35b-instruct",
      temperature = 0.7,
      top_p = 0.8,
      max_tokens = 8192,
      systemPrompt,
    } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required.",
      });
    }

    const finalSystemPrompt =
      systemPrompt && systemPrompt.trim()
        ? systemPrompt.trim()
        : DEFAULT_SYSTEM_PROMPT;

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: finalSystemPrompt },
        { role: "user", content: prompt.trim() },
      ],
      temperature: Number(temperature),
      top_p: Number(top_p),
      max_tokens: Number(max_tokens),
      stream: false,
    });

    const text =
      completion?.choices?.[0]?.message?.content?.trim() ||
      "No response returned from model.";

    return res.status(200).json({
      success: true,
      message: "NVIDIA API test successful.",
      data: {
        model,
        output: text,
        usage: completion?.usage || null,
      },
    });
  } catch (error) {
    console.error("NVIDIA API Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error?.response?.data?.error?.message ||
        error?.message ||
        "Failed to test NVIDIA API.",
    });
  }
};