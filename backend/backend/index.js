import express from 'express';
import pg from 'pg';
import cors from 'cors';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

dotenv.config(); // Load RUNWARE_API_KEY from .env

const app = express();
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', // your frontend URL
  credentials: true
}));
app.use(express.json()); // Parse JSON bodies

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

app.use(async (req, res, next) => {
  if (!req.cookies.user_id) {
    // Create new anonymous user
    const result = await db.query(
      "INSERT INTO users (firstname, avatar) VALUES (NULL, NULL) RETURNING id"
    );
    const userId = result.rows[0].id;

    // Save in cookie so we know them next time
    res.cookie("user_id", userId, { httpOnly: true });
    req.userId = userId;
  } else {
    req.userId = req.cookies.user_id;
  }
  next();
});

app.post('/inserUser', async (req, res) => {
  const { name, image } = req.body;
  try {
    // Check if user exists
    const userResult = await db.query(
      "SELECT * FROM users WHERE id = $1",
      [req.userId]
    );

    if (userResult.rows.length > 0) {
      // User exists, update name and image
      await db.query(
        "UPDATE users SET firstname = $1, avatar = $2 WHERE id = $3",
        [name, image, req.userId]
      );
      res.status(200).json({ message: 'User updated successfully' });
    } else {
      // User does not exist, insert new user
      await db.query(
        "INSERT INTO users (id, firstname, avatar) VALUES ($1, $2, $3)",
        [req.userId, name, image]
      );
      res.status(200).json({ message: 'User inserted successfully' });
    }
  } catch (err) {
    console.error('Error inserting/updating user:', err);
    res.status(500).json({ error: 'Failed to insert/update user' });
  }
});

app.post('/join_game', async (req, res) => {
  const { otp } = req.body;
  try {
    // Check if game exists
    const gameResult = await db.query(
      "SELECT * FROM game WHERE id = $1"
      , [otp]
    );
    if (gameResult.rows.length === 0) {
      return res.status(404).json({ error: "Game not found" });
    }
    else{
      return res.status(200).json({ message: "Game found" });
    }
  } catch (err) {
    console.error('Error joining game:', err);
    res.status(500).json({ error: 'Failed to join game' });
  }
});

app.get('/getUser', async (req, res) => {
  console.log("Fetching user data for ID:", req.userId);
  try {
    const userResult = await db.query(
      "SELECT firstname, avatar FROM users WHERE id = $1",
      [req.userId]
    );
    if (userResult.rows.length > 0) {
      res.json(userResult.rows[0]);
      console.log("User data:", userResult.rows[0]);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

app.get("/joining_game", async (req, res) => {
  const user = await db.query("SELECT * FROM users WHERE id = $1", [req.userId]);
  res.json(user.rows[0]);
});





/**
 * GET all submissions
 */

app.post('/GetSubs', (req, res) => {
    const { game_id } = req.body; // Extract game_id from the body

    if (!game_id) {
        return res.status(400).json({ error: "Missing game_id" });
    }

    db.query(
        'SELECT * FROM submission WHERE game_id = $1',
        [game_id],
        (err, result) => {
            if (err) {
                console.error("Error querying database:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.json(result.rows);
        }
    );
});

app.post('/creategame', async (req, res) => {
    try {
    await db.query("INSERT INTO game (id, image_1_id, image_2_id) VALUES ($1, $2, $3)",
        [req.body.ids, req.body.image1, req.body.image2],)
        res.status(200).json({ message: 'Game Created successfully' });
    } catch (err) {
    console.error('Error saving submission:', err);
    res.status(500).json({ error: 'Failed to Create a Game' });
  }        

});

app.get('/getimages', (req, res) => {
    db.query("SELECT * FROM images", (err, result) => {  
        if (err) {
            console.error("Error querying database:", err);
            res.status(500).json({ error: "Database error" });
        } else {
            res.json(result.rows);
        }
    })});

app.post('/Save', async (req, res) => {
  let { imageURL, prompt, tip, score, user_name, game_id } = req.body;
  score = Number(score); // 🔑 convert to number
    console.log("Received data:", { imageURL, prompt, tip, score, user_name, game_id });
  try {
    await db.query(
      'INSERT INTO submission (image_url, prompt, tip, score, user_name,game_id) VALUES ($1, $2, $3, $4, $5, $6)',
      [imageURL, prompt, tip, score, user_name, game_id]
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
