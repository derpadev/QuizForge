import express from "express";
import cors from "cors";
import OpenAI from "openai";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const client = new OpenAI({
  apiKey:
    process.env.OPENAI_API_KEY,
});
app.use(express.json());
app.use(cors());

app.post("/generate", async (req, res) => {
  const topic = req.body.topic;
  console.log("Recieved topic: ", topic);
  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `Generate 5 multiple choice questions on ${topic} with the following JSON object structure:
        {
          "questions": [{
            "id": "1",
            "question": "What is 1 + 1?",
            "choices": ["1", "2", "3", "4"],
            "correctIndex": 2,
            "explanation": "The correct answer is 2 because 1 + 1 = 2.",
            "difficulty": "easy",
          }]
        }

        Guidelines:

        1. Keep **question** field as normal text (e.g., "Find the derivative of..."). 
        2. Wrap **all numbers, formulas, and math expressions in proper LaTeX** using $...$ for the **question** and **choices** fields and use inline math or $$...$$ for display math.
        3. Use LaTeX formatting for derivatives, fractions, exponents, integrals, etc.

        Example output:

        {
          "questions": [{
            "question": "Find the derivative of the following $f(x) = 3x^4 - 5x^2 + 6x - 7$.",
            "choices": ["$f'(x) = 12x^3 - 10x + 6$", "$f'(x) = 12x^3 - 10x + 7$", "$f'(x) = 12x^3 - 10x + 8$", "$f'(x) = 12x^3 - 10x + 9$"],
            "correctIndex": "1",
            "explanation": "The correct answer is 12x^3 - 10x + 6 because the derivative of 3x^4 is 12x^3, the derivative of -5x^2 is -10x, and the derivative of 6x is 6.",
            "difficulty": "easy",
            "tags": ["calculus", "derivatives"],
          },
          {
            "question": "Find the derivative of the following $\\int_0^1 x^2 \\\\, dx$.",
            "choices": ["$\\int_0^1 x^2 \\\\, dx = \\frac{1}{3}$", "$f'(x) = 12x^3 - 10x + 7$", "$f'(x) = 12x^3 - 10x + 8$", "$f'(x) = 12x^3 - 10x + 9$"],
            "correctIndex": "1",
            "explanation": "The correct answer is 12x^3 - 10x + 6 because the derivative of 3x^4 is 12x^3, the derivative of -5x^2 is -10x, and the derivative of 6x is 6.",
            "difficulty": "easy",
            "tags": ["calculus", "derivatives"],
          }
          
          ]
        }

        Now generate 5 new problems with solutions following this format.`,
    });

    // debugging
    // console.log(JSON.stringify(response, null, 2));

    const gptText = response.output[0].content[0].text;
    
    // debugging
    // console.log(res)
    // GPT returns a string (proven below)
    // console.log(typeof res)

    // filter the ```json ... ``` so we can turn STRING into JSON with
    const cleaned = gptText.split("```").join("").replace("json", "")

    // data is JavaScript Object
    const data = JSON.parse(cleaned)
    console.log(data)

    // res.json() converts to JSON (not the same as JS Object)
    res.json(data)

  } catch (err) {
    console.error(err);
    res.status(500).send("Error Generating Worksheet");
  }
});

app.listen(PORT, (err) => {
  console.log("Server is running on PORT: ", PORT);
});
