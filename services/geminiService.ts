
import { GoogleGenAI, Type } from "@google/genai";
import { BugItem, WebReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeWebsite = async (url: string): Promise<WebReport> => {
  // In a real app, you would fetch the website content via a proxy or serverless function.
  // Since we are client-side only, we'll prompt Gemini to act as a remote scanner
  // that uses its internal knowledge/simulated crawl to identify common bugs for that URL.
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Perform a comprehensive bug audit for the website: ${url}. 
    Identify common accessibility, security, performance, and SEO issues. 
    Be specific. If you can't access live data, provide a heuristic analysis based on common patterns for this type of domain.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "Overall health score from 0-100" },
          summary: { type: Type.STRING, description: "A brief professional summary of the site's state." },
          bugs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING, enum: ['Accessibility', 'Performance', 'Security', 'SEO', 'HTML/CSS'] },
                severity: { type: Type.STRING, enum: ['Critical', 'High', 'Medium', 'Low'] },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                solution: { type: Type.STRING },
                codeSnippet: { type: Type.STRING, description: "Example code fix if applicable" }
              },
              required: ["category", "severity", "title", "description", "solution"]
            }
          }
        },
        required: ["score", "summary", "bugs"]
      }
    }
  });

  const rawResult = JSON.parse(response.text);
  
  return {
    url,
    scanDate: new Date().toLocaleString(),
    score: rawResult.score,
    summary: rawResult.summary,
    bugs: rawResult.bugs.map((bug: any, index: number) => ({
      ...bug,
      id: `bug-${index}`
    }))
  };
};
