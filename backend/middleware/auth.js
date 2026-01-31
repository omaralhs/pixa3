import db from '../config/database.js';

export const authenticateUser = async (req, res, next) => {
  if (!req.cookies.user_id) {
    try {
      // Create a new user with empty strings
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
};
