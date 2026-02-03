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
    // Get the current image for this game
    const gameResult = await db.query(
      "SELECT current_image, image_1_id, image_2_id FROM game WHERE id = $1",
      [gameid]
    );

    if (gameResult.rows.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const currentImageNumber = gameResult.rows[0].current_image;
    const imageIdField = currentImageNumber === 1 ? 'image_1_id' : 'image_2_id';
    const image_id = gameResult.rows[0][imageIdField];

    // Count submissions for this user, game, and current image only
    const result = await db.query(
      "SELECT COUNT(*) FROM submission WHERE game_id = $1 AND user_id = $2 AND image_id = $3",
      [gameid, userId, image_id]
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

    // Get the current image number for this game
    const gameResult = await db.query(
      "SELECT current_image FROM game WHERE id = $1",
      [game_id]
    );

    if (gameResult.rows.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const currentImageNumber = gameResult.rows[0].current_image;

    // Get the actual image_id from the game table
    const imageIdField = currentImageNumber === 1 ? 'image_1_id' : 'image_2_id';
    const imageIdResult = await db.query(
      `SELECT ${imageIdField} as image_id FROM game WHERE id = $1`,
      [game_id]
    );

    const image_id = imageIdResult.rows[0].image_id;

    // Check if a submission already exists for this user, game, and image
    const existing = await db.query(
      "SELECT id, trys FROM submission WHERE game_id = $1 AND user_id = $2 AND image_id = $3",
      [game_id, userId, image_id]
    );

    let trys;
    if (existing.rows.length > 0) {
      // Update existing submission (second try)
      trys = 2;

      await db.query(
        `UPDATE submission
         SET image_url = $1,
             prompt = $2,
             tip = $3,
             score = $4,
             user_name = $5,
             trys = $6
         WHERE game_id = $7 AND user_id = $8 AND image_id = $9`,
        [imageURL, prompt, tip, score, firstName, trys, game_id, userId, image_id]
      );

      console.log("Updated existing submission for image", image_id);
    } else {
      // Insert new submission (first try)
      trys = 1;

      await db.query(
        `INSERT INTO submission (image_url, prompt, tip, score, user_name, game_id, trys, user_id, image_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [imageURL, prompt, tip, score, firstName, game_id, trys, userId, image_id]
      );

      console.log("Inserted new submission for image", image_id);
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
    // Calculate final score as the sum of the highest score from each image
    const result = await db.query(
      `SELECT 
         u.id AS user_id,
         u.firstname,
         u.avatar,
         COALESCE(SUM(max_scores.max_score), 0) AS final_score
       FROM users u
       LEFT JOIN (
         SELECT 
           user_id,
           image_id,
           MAX(score) AS max_score
         FROM submission
         WHERE game_id = $1
         GROUP BY user_id, image_id
       ) AS max_scores ON u.id = max_scores.user_id
       WHERE u.id IN (
         SELECT DISTINCT user_id 
         FROM submission 
         WHERE game_id = $1
       )
       GROUP BY u.id, u.firstname, u.avatar
       ORDER BY final_score DESC
       LIMIT 3`,
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
