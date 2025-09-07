import express from 'express';
import pg from 'pg';
import cors from 'cors';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";
dotenv.config(); // Load RUNWARE_API_KEY from .env

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.set("io", io);

io.on("connection", (socket) => {
  console.log("A user connected");

  // 👉 Join a game room (used for things like "started")
  socket.on("joinGame", (gameId) => {
    socket.join(gameId);
    console.log(`User joined game room ${gameId}`);
  });

  // 👉 Wait for subs updates in a game
  socket.on("waiting_for_subs", (gameId) => {
    socket.join(gameId);
    console.log(`User is waiting for subs in game ${gameId}`);
  });

   // New event from client to broadcast when a user joins
  socket.on("waiting_for_users", (gameId) => {
    socket.join(gameId);
    console.log(` game: ${gameId} - waiting for users to join it game`);

  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

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
    try {
      // Use empty strings instead of NULL to avoid DB errors
      const result = await db.query(
        "INSERT INTO users (firstname, avatar) VALUES ($1, $2) RETURNING id",
        ['', '']
      );
      if (!result.rows[0]) {
        throw new Error("Failed to create user");
      }
      const userId = result.rows[0].id;
      res.cookie("user_id", userId, { httpOnly: true });
      req.userId = userId;
    } catch (err) {
      console.error("Error creating user:", err);
      return res.status(500).json({ error: "Failed to create user" });
    }
  } else {
    req.userId = req.cookies.user_id;
  }
  next();
});

app.post('/start_game', async (req, res) => {
  const { game_id } = req.body;

  try {
    // Check if the game exists
    const gameResult = await db.query(
      "SELECT * FROM game WHERE id = $1",
      [game_id]
    );

    if (gameResult.rows.length === 0) {
      return res.status(404).json({ error: "Game not found" });
    }

    // Update 'started' to true
    await db.query(
      "UPDATE game SET started = true WHERE id = $1",
      [game_id]
    );

    // Notify all clients in this game room
    io.to(game_id).emit("started");

    res.status(200).json({ message: "Game started" });

  } catch (err) {
    console.error('Error starting game:', err);
    res.status(500).json({ error: 'Failed to start game' });
  }
});

app.get('/check_game_started', async (req, res) => {
  const { game_id } = req.query;
  try {
    const result = await db.query(
      "SELECT started FROM game WHERE id = $1",
      [game_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Game not found" });
    }

    res.json({ started: result.rows[0].started });

  } catch (err) {
    console.error('Error checking game status:', err);
    res.status(500).json({ error: 'Failed to check game status' });
  }
});

app.post("/chat",
  async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // or another GPT model
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: process.env.GptPrompt+message },
        ],
      }),
    });

    const data = await response.json();
if (
  !data.choices ||
  !Array.isArray(data.choices) ||
  !data.choices[0] ||
  !data.choices[0].message ||
  !data.choices[0].message.content
) {
  console.error("Unexpected OpenAI response:", data);
  return res.status(500).json({ error: "Invalid response from OpenAI" });
}
res.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

 async function complete (prompt) {
   try {
    const { message } = prompt;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // or another GPT model
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: process.env.GptPrompt+message },
        ],
      }),
    });

    const data = await response.json();
if (
  !data.choices ||
  !Array.isArray(data.choices) ||
  !data.choices[0] ||
  !data.choices[0].message ||
  !data.choices[0].message.content
) {
  console.error("Unexpected OpenAI response:", data);
}
    return data.choices[0].message.content;
  } catch (error) {
    console.error(error);
  }
};


app.post('/inserUser', async (req, res) => {
  const { name, image, gameId } = req.body; // <-- receive gameId from frontend
  console.log("Inserting/Updating user: &*&*&*&*&&*&*", { name, image, gameId, userId: req.userId });
  if (!gameId) {
    return res.status(400).json({ error: "gameId is required" });
  }
  try {
    const seed = name || req.userId;
    const avatarUrl = image || `https://api.dicebear.com/9.x/bottts/svg?seed=${encodeURIComponent(seed)}`;

    const userResult = await db.query("SELECT * FROM users WHERE id = $1", [req.userId]);

   if (userResult.rows.length > 0) {
  await db.query(
    "UPDATE users SET firstname = $1, avatar = $2, current_game = $3 WHERE id = $4",
    [name, avatarUrl, gameId, req.userId]
  );
} else {
  await db.query(
    "INSERT INTO users (id, firstname, avatar, current_game) VALUES ($1, $2, $3, $4)",
    [req.userId, name, avatarUrl , gameId]
  );
}


    // Fetch updated users for the game
    const updatedUsersResult = await db.query(
      `SELECT u.* 
       FROM users u
       JOIN game_users gu ON u.id = gu.user_id
       WHERE gu.game_id = $1`,
      [gameId]
    );

    io.to(gameId).emit('userJoined');

    res.status(200).json({ message: 'User inserted/updated successfully', avatarUrl });

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


    
app.get('/gettrys', async (req, res) => {
  const gameid = req.query.gameid;
  const userId = req.userId; // 🔑 pass userId in query

  try {
    const result = await db.query(
      "SELECT COUNT(*) FROM submission WHERE game_id = $1 AND user_id = $2",
      [gameid, userId]
    );

    const trys = parseInt(result.rows[0].count, 10);
    res.json({ trys });
  } catch (err) {
    console.error('Error fetching trys:', err);
    res.status(500).json({ error: 'Failed to fetch trys' });
  }
});


app.post('/Save', async (req, res) => {
  const userId = req.userId; // 🔑 Pass userId in query or token
  let { imageURL, prompt, tip, score, user_name, game_id } = req.body;
  score = Number(score); // 🔑 Ensure score is a number

  try {
    // ✅ Get feedback from OpenAI
    let feedbackRow = await complete(prompt);
    let feedback = JSON.parse(feedbackRow);
    tip = feedback.tip;
    score = feedback.score;
    console.log("Feedback from OpenAI:", feedback.score);

    // ✅ Fetch user's first_name from the database
    const userResult = await db.query(
      "SELECT firstname FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const firstName = userResult.rows[0].firstname;
    console.log("User's first name:", firstName);

    // ✅ Check if a submission already exists for this user and game
    const existing = await db.query(
      "SELECT trys FROM submission WHERE game_id = $1 AND user_id = $2",
      [game_id, userId]
    );

    let trys;
    if (existing.rows.length > 0) {
      // 🔁 Update existing submission
      trys = 2

      await db.query(
        `UPDATE submission
         SET image_url = $1,
             prompt = $2,
             tip = $3,
             score = $4,
             user_name = $5,
             trys = $6
             final_score= final_score + $4
         WHERE game_id = $7 AND user_id = $8`,
        [imageURL, prompt, tip, score, firstName, trys, game_id, userId]
      );

      console.log("Updated existing submission");
    } else {
      // 🆕 Insert new submission
      trys = 1;

      await db.query(
        `INSERT INTO submission (image_url, prompt, tip, score, user_name, game_id, trys, user_id, final_score)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8 , $4)`,
        [imageURL, prompt, tip, score, firstName, game_id, trys, userId]
      );

      console.log("Inserted new submission");
    }

    // ✅ Notify all clients in this game room
    io.to(game_id).emit("subs_updated");

    res.status(200).json({
      message: 'Submission saved successfully',
      numberOfTrys: trys,
      Tip: tip,
      Score: score,
    });

  } catch (err) {
    console.error('Error saving submission:', err);
    res.status(500).json({ error: 'Failed to save submission' });
  }
});

app.get('/gettopplayers/:game_id', async (req, res) => {
  const { game_id } = req.params;

  try {
    // ✅ Join submissions with users to get full user info
    const result = await db.query(
      `SELECT 
         u.id AS user_id,
         u.firstname,
         u.avatar,
         s.score,
         s.final_score,
         s.trys
       FROM submission s
       JOIN users u ON s.user_id = u.id
       WHERE s.game_id = $1
       ORDER BY s.final_score DESC`,
      [game_id]
    );

    res.status(200).json({
      players: result.rows
    });

  } catch (err) {
    console.error("Error fetching top players:", err);
    res.status(500).json({ error: "Failed to fetch top players" });
  }
});


app.get("/image-number", async (req, res) => {
  const gameID = req.query.gameID; // get from ?gameID=123
  if (!gameID) return res.status(400).json({ error: "gameID is required" });

  try {
    const result = await db.query(
      "SELECT current_image FROM game WHERE id = $1 LIMIT 1",
      [gameID]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Game not found" });

    res.json({ image_number: result.rows[0].current_image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/next-image", async (req, res) => {
  const gameID = req.query.gameID; // get from ?gameID=123
  if (!gameID) return res.status(400).json({ error: "gameID is required" });

  try {
    const result = await db.query(
      `UPDATE game
       SET current_image = current_image + 1
       WHERE id = $1
       RETURNING current_image`,
      [gameID]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Game not found" });

    res.json({ image_number: result.rows[0].current_image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// ========================
// Get all images for a game
// ========================
app.get("/game-images", async (req, res) => {
  const gameID = req.query.gameID;
  if (!gameID) return res.status(400).json({ error: "gameID is required" });

  try {
    // 1️⃣ Get the game row with image IDs
    const gameResult = await db.query(
      "SELECT image_1_id, image_2_id FROM game WHERE id = $1 LIMIT 1",
      [gameID]
    );

    if (gameResult.rows.length === 0)
      return res.status(404).json({ error: "Game not found" });

    const { image_1_id, image_2_id } = gameResult.rows[0];

    // 2️⃣ Fetch the actual image info from images table
    const imagesResult = await db.query(
      "SELECT id, url FROM images WHERE id = ANY($1::int[])",
      [[image_1_id, image_2_id]] // array of image IDs
    );

    res.json({ images: imagesResult.rows }); // [{id, url}, ...]
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/gameusers", async (req, res) => {
  const gameId = req.query.ids; // e.g. 12345
  try {
    const result = await db.query(
      `SELECT * 
       FROM users 
       WHERE current_game = $1`,
      [gameId]
    );
    console.log("Fetched users for game:", gameId, result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users for game:", err);
    res.status(500).json({ error: "Failed to fetch users" });
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

        let name = await db.query("SELECT firstname FROM users WHERE id = $1", [req.userId]);


        // Return the image URL
        res.json({ imageURL });

    } catch (err) {
        console.error("Runware API error:", err.message);
        res.status(500).json({ error: "Image generation failed" });
    }
});

// Start server
server.listen(5000, () => {
  console.log("Server with Socket.IO is listening on port 5000");
});
