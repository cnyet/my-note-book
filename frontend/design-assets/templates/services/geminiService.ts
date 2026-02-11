
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Always use the process.env.API_KEY directly for initialization as per guidelines
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateDesignFeedback(prompt: string) {
    try {
      const response = await this.ai.models.generateContent({
        // Using gemini-3-pro-preview for complex reasoning tasks like UI/UX consulting
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          systemInstruction: "You are an elite UI/UX Design Consultant. Provide concise, professional, and actionable design advice. Keep answers under 3 sentences.",
          temperature: 0.7,
        },
      });
      // Access the .text property directly (not as a method)
      return response.text || "I'm having trouble thinking of advice right now.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Unable to reach the design assistant.";
    }
  }

  async analyzeImage(base64Data: string, mimeType: string) {
    try {
      const response = await this.ai.models.generateContent({
        // Using gemini-3-pro-preview for high-fidelity multimodal reasoning
        model: 'gemini-3-pro-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType } },
            { text: "Analyze this image's design aesthetic. What are the dominant colors and how could the typography be improved?" }
          ]
        },
        config: {
            systemInstruction: "You are a visual design expert. Analyze images for color palettes, spacing, and font choices."
        }
      });
      // Access the .text property directly
      return response.text || "Image analysis failed.";
    } catch (error) {
      console.error("Gemini Image Error:", error);
      return "Unable to analyze the image.";
    }
  }
}

export const geminiService = new GeminiService();