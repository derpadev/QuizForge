import express from "express";
import { generateQuiz } from "../services/generateQuiz.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const topic = req.body.topic;

  console.log("Recieved topic: ", topic);

  try {
    // [1] Generate questions (LLM call)
    const data = await generateQuiz(topic);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error Generating Worksheet");
  }
});

export default router;
