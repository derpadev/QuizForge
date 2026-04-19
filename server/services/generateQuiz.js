import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateQuiz(topic) {
  const prompt = `Generate 5 multiple choice questions on ${topic} with the following JSON object structure:
        {
          "questions": [{
            "id": "1",
            "question": "What is 1 + 1?",
            "choices": ["1", "2", "3", "4"],
            "correctIndex": 2,
            "explanation": "The correct answer is 2 because 1 + 1 = 2.",
            "difficulty": "easy",
          }]
        }`;
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
    text: {
      format: {
        type: "json_object",
      },
    },
  });

  return JSON.parse(response.output[0].content[0].text);
}
