import express from 'express';
import pg from 'pg';
import cors from 'cors';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config(); // Load RUNWARE_API_KEY from .env

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON bodies
console.log("Runware API key:", process.env.RUNWARE_API_KEY);

// PostgreSQL setup
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "pixa",
    password: "9988",
    port: 5432,
});

db.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("Database connection error:", err));

/**
 * GET all submissions
 */
app.get('/api/submissions', (req, res) => {
    db.query("SELECT * FROM submission", (err, result) => {
        if (err) {
            console.error("Error querying database:", err);
            res.status(500).json({ error: "Database error" });
        } else {
            res.json(result.rows);
        }
    });
});

app.post('/Save', async (req, res) => {
  let { imageURL, prompt, tip, score, user_name } = req.body;
  score = Number(score); // 🔑 convert to number

  try {
    await db.query(
      'INSERT INTO submission (image_url, prompt, tip, score, user_name) VALUES ($1, $2, $3, $4, $5)',
      [imageURL, prompt, tip, score, user_name]
    );
    res.status(200).json({ message: 'Submission saved successfully' });
  } catch (err) {
    console.error('Error saving submission:', err);
    res.status(500).json({ error: 'Failed to save submission' });
  }
});

/**
 * POST /gen - Generate an image using Runware
 */
app.post('/gen', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        const taskUUID = uuidv4();

        const requestBody = [
            {   taskType: "authentication",
                apiKey: process.env.RUNWARE_API_KEY },
             {
        "taskType": "imageInference",
        "taskUUID": "39d7207a-87ef-4c93-8082-1431f9c1dc97",
        "positivePrompt": prompt,
        "width": 1024,
        "height": 1024,
        "steps": 50,
        "model": "runware:101@1",
        "checkNSFW": true, 
        "numberResults": 1
    }
        ];

        const response = await axios.post("https://api.runware.ai/v1", requestBody, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        const imageURL = response.data?.data?.[0]?.imageURL;
        if (!imageURL) {
            return res.status(500).json({ error: "No image returned from Runware" });
        }

        res.json({ imageURL });

    } catch (err) {
        console.error("Runware API error:", err.message);
        res.status(500).json({ error: "Image generation failed" });
    }
});

// Start server
app.listen(5000, () => {
    console.log("Server is listening on port 5000");
});
