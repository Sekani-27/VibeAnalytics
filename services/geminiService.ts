
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Sentiment } from "../types";

let aiInstance: GoogleGenAI | null = null;

const getAiInstance = (): GoogleGenAI => {
    if (aiInstance) {
        return aiInstance;
    }

    // This check is crucial for browser environments without a build step.
    // It prevents a crash if `process.env.API_KEY` is not available.
    if (typeof process === 'undefined' || !process.env || !process.env.API_KEY) {
        throw new Error("Gemini API key is not configured. Please set the API_KEY environment variable in your deployment settings.");
    }
    
    aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    return aiInstance;
};


const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      text: {
        type: Type.STRING,
        description: "The original sentence being analyzed."
      },
      sentiment: {
        type: Type.STRING,
        // FIX: The `enum` property is not supported in the response schema. The prompt provides the necessary constraints.
        description: "The sentiment of the sentence. Must be one of 'POSITIVE', 'NEGATIVE', or 'NEUTRAL'."
      },
      confidence: {
        type: Type.NUMBER,
        description: "A confidence score between 0.0 and 1.0 for the sentiment analysis."
      }
    },
    required: ["text", "sentiment", "confidence"]
  }
};

export async function analyzeSentences(text: string): Promise<AnalysisResult[]> {
  try {
    const ai = getAiInstance(); // Get or initialize the AI instance safely.
    const prompt = `Analyze the sentiment of the following text. Split the text into individual sentences. For each sentence, provide its sentiment (must be one of 'POSITIVE', 'NEGATIVE', or 'NEUTRAL') and a confidence score from 0.0 to 1.0. 
    
    Here is the text:
    ---
    ${text}
    ---
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonString = response.text;
    const parsedResults = JSON.parse(jsonString);

    if (!Array.isArray(parsedResults)) {
        throw new Error("API returned an invalid format.");
    }

    return parsedResults.map((item: any) => ({
      text: item.text,
      sentiment: item.sentiment as Sentiment,
      confidence: item.confidence
    }));

  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    // The error from getAiInstance will be caught here and re-thrown with a more user-friendly message.
    if (error instanceof Error && error.message.includes("Gemini API key is not configured")) {
        throw error;
    }
    throw new Error("Failed to analyze sentiment. Please check the console for more details.");
  }
}
