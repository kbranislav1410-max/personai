import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing environment variable: OPENAI_API_KEY");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Sends a plain-text prompt to the OpenAI Chat Completions API and returns
 * the model's response as a string.
 *
 * This function is intended for server-side use only. The API key is never
 * exposed to the client.
 *
 * @param prompt - The prompt to send to the model.
 * @returns The generated text response.
 * @throws {Error} When the API key is missing or the API call fails.
 */
export async function generateText(prompt: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI returned an empty response.");
  }

  return content;
}
