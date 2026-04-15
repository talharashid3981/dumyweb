import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();


const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1",
});

export const testNvidiaAPI = async (req, res) => {
  try {
    const {
      prompt,
      model = "qwen/qwen3-coder-480b-a35b-instruct",
      temperature = 0.7,
      top_p = 0.8,
      max_tokens = 1024,
      systemPrompt = "You are a helpful coding assistant.",
    } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required.",
      });
    }

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: Number(temperature),
      top_p: Number(top_p),
      max_tokens: Number(max_tokens),
      stream: false,
    });

    const text =
      completion?.choices?.[0]?.message?.content ||
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