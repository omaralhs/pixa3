import db from '../config/database.js';
import { chatWithOpenAI } from '../services/openai.service.js';
import { generateImage } from '../services/runware.service.js';

export const chat = async (req, res) => {
  try {
    const { message } = req.body;
    const reply = await chatWithOpenAI(message);
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const generateAIImage = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const imageURL = await generateImage(prompt);
    res.json({ imageURL });
  } catch (err) {
    console.error("Image generation error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getImages = (req, res) => {
  db.query("SELECT * FROM images", (err, result) => {
    if (err) {
      console.error("Error querying database:", err);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(result.rows);
    }
  });
};
