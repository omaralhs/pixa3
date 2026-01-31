import db from '../config/database.js';

export const startGame = async (req, res) => {
  const { game_id } = req.body;

  try {
    const gameResult = await db.query(
      "SELECT * FROM game WHERE id = $1",
      [game_id]
    );

    if (gameResult.rows.length === 0) {
      return res.status(404).json({ error: "Game not found" });
    }

    await db.query(
      "UPDATE game SET started = true WHERE id = $1",
      [game_id]
    );

    const io = req.app.get("io");
    io.to(game_id).emit("started");

    res.status(200).json({ message: "Game started" });
  } catch (err) {
    console.error('Error starting game:', err);
    res.status(500).json({ error: 'Failed to start game' });
  }
};

export const checkGameStarted = async (req, res) => {
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
};

export const createGame = async (req, res) => {
  try {
    await db.query(
      "INSERT INTO game (id, image_1_id, image_2_id) VALUES ($1, $2, $3)",
      [req.body.ids, req.body.image1, req.body.image2]
    );
    res.status(200).json({ message: 'Game Created successfully' });
  } catch (err) {
    console.error('Error creating game:', err);
    res.status(500).json({ error: 'Failed to Create a Game' });
  }
};

export const joinGame = async (req, res) => {
  const { otp } = req.body;
  
  try {
    const gameResult = await db.query(
      "SELECT * FROM game WHERE id = $1",
      [otp]
    );
    
    if (gameResult.rows.length === 0) {
      return res.status(404).json({ error: "Game not found" });
    }
    
    return res.status(200).json({ message: "Game found" });
  } catch (err) {
    console.error('Error joining game:', err);
    res.status(500).json({ error: 'Failed to join game' });
  }
};

export const getImageNumber = async (req, res) => {
  const gameID = req.query.gameID;
  
  if (!gameID) {
    return res.status(400).json({ error: "gameID is required" });
  }

  try {
    const result = await db.query(
      "SELECT current_image FROM game WHERE id = $1 LIMIT 1",
      [gameID]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Game not found" });
    }

    res.json({ image_number: result.rows[0].current_image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const nextImage = async (req, res) => {
  const gameID = req.query.gameID;
  
  if (!gameID) {
    return res.status(400).json({ error: "gameID is required" });
  }

  try {
    const result = await db.query(
      `UPDATE game
       SET current_image = current_image + 1
       WHERE id = $1
       RETURNING current_image`,
      [gameID]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Game not found" });
    }

    res.json({ image_number: result.rows[0].current_image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getGameImages = async (req, res) => {
  const gameID = req.query.gameID;
  
  if (!gameID) {
    return res.status(400).json({ error: "gameID is required" });
  }

  try {
    const gameResult = await db.query(
      "SELECT image_1_id, image_2_id FROM game WHERE id = $1 LIMIT 1",
      [gameID]
    );

    if (gameResult.rows.length === 0) {
      return res.status(404).json({ error: "Game not found" });
    }

    const { image_1_id, image_2_id } = gameResult.rows[0];

    const imagesResult = await db.query(
      "SELECT id, url FROM images WHERE id = ANY($1::int[])",
      [[image_1_id, image_2_id]]
    );

    res.json({ images: imagesResult.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getGameUsers = async (req, res) => {
  const gameId = req.query.ids;
  
  try {
    const result = await db.query(
      `SELECT u.* FROM users u
       INNER JOIN game_users gu ON u.id = gu.user_id
       WHERE gu.game_id = $1`,
      [gameId]
    );
    console.log("Fetched users for game:", gameId, result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users for game:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
