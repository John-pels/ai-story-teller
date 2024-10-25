import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function generateStory(theme: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Generate an interactive African folklore story based on the theme or character: "${theme}". 
  The story should be educational, culturally accurate, and suitable for all ages. 
  Include traditional African elements, moral lessons, and vivid descriptions. 
  Format the story in multiple paragraphs, with each paragraph representing a 'page' in the interactive story.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}
