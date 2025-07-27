import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question } = req.body;

  if (!question || question.trim() === "") {
    return res.status(400).json({ error: "Question is required" });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: question }],
      max_tokens: 150,
    });

    const answer = completion.data.choices[0].message.content;

    res.status(200).json({ answer });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Failed to get response from AI" });
  }
}
