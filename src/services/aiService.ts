import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

// Lazy initialization variables
let genAI: GoogleGenAI | null = null;
let groqClient: Groq | null = null;

function getGemini() {
  if (!genAI) {
    const key = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_2;
    if (!key) {
      console.warn("Neither GEMINI_API_KEY nor GEMINI_API_KEY_2 are found. AI features may not work.");
    }
    genAI = new GoogleGenAI({ apiKey: key || "" });
  }
  return genAI;
}

function getGroq() {
  if (!groqClient) {
    const key = process.env.GROQ_API_KEY;
    if (key) {
      groqClient = new Groq({ 
        apiKey: key, 
        dangerouslyAllowBrowser: true // Allowed in AI Studio preview sandbox
      });
    }
  }
  return groqClient;
}

export async function orchestrateAI(prompt: string, systemPrompt?: string) {
  const groq = getGroq();
  const ai = getGemini();

  // 1. Try Groq (High performance, generous credits)
  if (groq) {
    try {
      console.log("Attempting AI generation with Groq...");
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt || "You are a luxury real estate concierge for House BZ." },
          { role: "user", content: prompt },
        ],
        model: "llama-3-70b-8192", // Updated model name for better performance
      });
      return completion.choices[0]?.message?.content || "";
    } catch (error) {
      console.warn("Groq failed, falling back to Gemini:", error);
    }
  }

  // 2. Fallback to Gemini
  try {
    console.log("Attempting AI generation with Gemini...");
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt || "You are a luxury real estate concierge for House BZ.",
      }
    });

    return response.text || "";
  } catch (error) {
    console.error("All AI providers failed:", error);
    return "Our AI concierge is currently offline. Please try again later.";
  }
}
