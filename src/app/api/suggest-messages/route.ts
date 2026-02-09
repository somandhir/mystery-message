import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { prompt: theme } = await req.json(); 

    const systemPrompt = `You are a creative assistant for an anonymous messaging app. 
    Create exactly three questions. 
    Format: Separate them with '||'. No numbering. No extra text.`;

    const userPrompt = `Generate 3 subtle and engaging questions with a **${theme || 'random'}** vibe. 
    Example: What's a secret hobby?||Where would you travel?||Best advice?`;

    const result = streamText({
      model: google('gemini-1.5-flash'), 
      system: systemPrompt,
      prompt: userPrompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Gemini Error:", error);
    return new Response("Error", { status: 500 });
  }
}