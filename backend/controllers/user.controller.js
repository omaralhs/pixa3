import db from '../config/database.js';

export const insertUser = async (req, res) => {
  const { name, image, gameId } = req.body;
  console.log("Inserting/Updating user:", { name, image, gameId, userId: req.userId });
  
  if (!gameId) {
    return res.status(400).json({ error: "gameId is required" });
  }
  
  try {
    const seed = name || req.userId;
    const avatarUrl = image || `https://api.dicebear.com/9.x/bottts/svg?seed=${encodeURIComponent(seed)}`;

    const userResult = await db.query("SELECT * FROM users WHERE id = $1", [req.userId]);

    if (userResult.rows.length > 0) {
      await db.query(
        "UPDATE users SET firstname = $1, avatar = $2 WHERE id = $3",
        [name, avatarUrl, req.userId]
      );
    } else {
      await db.query(
        "INSERT INTO users (id, firstname, avatar) VALUES ($1, $2, $3)",
        [req.userId, name, avatarUrl]
      );
    }

    // Insert or update the game_users relationship
    await db.query(
      `INSERT INTO game_users (game_id, user_id) VALUES ($1, $2)
       ON CONFLICT (game_id, user_id) DO NOTHING`,
      [gameId, req.userId]
    );

    const io = req.app.get("io");
    io.to(gameId).emit('userJoined');

    res.status(200).json({ message: 'User inserted/updated successfully', avatarUrl });
  } catch (err) {
    console.error('Error inserting/updating user:', err);
    res.status(500).json({ error: 'Failed to insert/update user' });
  }
};

export const getUser = async (req, res) => {
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
};

export const joiningGame = async (req, res) => {
  try {
    const user = await db.query("SELECT * FROM users WHERE id = $1", [req.userId]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error('Error fetching joining game user:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};
