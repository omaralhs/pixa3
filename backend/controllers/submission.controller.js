import db from '../config/database.js';
import { getPromptFeedback } from '../services/openai.service.js';

export const getSubs = (req, res) => {
  const { game_id } = req.body;

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
};

export const getTrys = async (req, res) => {
  const gameid = req.query.gameid;
  const userId = req.userId;

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
};

export const saveSubmission = async (req, res) => {
  const userId = req.userId;
  let { imageURL, prompt, tip, score, user_name, game_id } = req.body;
  score = Number(score);

  try {
    // Get feedback from OpenAI
    let feedbackRow = await getPromptFeedback(prompt);
    let feedback = feedbackRow;
    tip = feedback.tip;
    score = feedback.score;
    console.log("Feedback from OpenAI:", feedback.score);

    // Fetch user's first_name from the database
    const userResult = await db.query(
      "SELECT firstname FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const firstName = userResult.rows[0].firstname;
    console.log("User's first name:", firstName);

    // Check if a submission already exists for this user and game
    const existing = await db.query(
      "SELECT trys FROM submission WHERE game_id = $1 AND user_id = $2",
      [game_id, userId]
    );

    let trys;
    if (existing.rows.length > 0) {
      // Update existing submission
      trys = 2;

      await db.query(
        `UPDATE submission
         SET image_url = $1,
             prompt = $2,
             tip = $3,
             score = $4,
             user_name = $5,
             trys = $6,
             final_score = final_score + $4
         WHERE game_id = $7 AND user_id = $8`,
        [imageURL, prompt, tip, score, firstName, trys, game_id, userId]
      );

      console.log("Updated existing submission");
    } else {
      // Insert new submission
      trys = 1;

      await db.query(
        `INSERT INTO submission (image_url, prompt, tip, score, user_name, game_id, trys, user_id, final_score)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $4)`,
        [imageURL, prompt, tip, score, firstName, game_id, trys, userId]
      );

      console.log("Inserted new submission");
    }

    // Notify all clients in this game room
    const io = req.app.get("io");
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
};

export const getTopPlayers = async (req, res) => {
  const { game_id } = req.params;

  try {
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
};
