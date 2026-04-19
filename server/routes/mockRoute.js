import express from "express";
import fs from "fs/promises";
import path from "path";

const router = express.Router();

router.post("/mock", async (req, res) => {
  console.log("Mock endpoint hit: ", req.body.topic);
  try {
    const filePath = path.join(process.cwd(), "mock.json");
    const data = await fs.readFile(filePath, "utf8");
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: "Error Reading Mock Worksheet" });
  }
});

export default router;
