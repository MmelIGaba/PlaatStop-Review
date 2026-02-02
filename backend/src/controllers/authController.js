const pool = require('../config/db');
const logger = require('../config/logger');

exports.syncUser = async (req, res, next) => {
  const { role, name, email } = req.body;

  const id = req.user.id; 

  try {
    const query = `
      INSERT INTO users (id, email, role, name, updated_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (id) 
      DO UPDATE SET 
        email = EXCLUDED.email, 
        role = COALESCE(users.role, EXCLUDED.role), -- Don't overwrite role if it exists (optional safety)
        name = EXCLUDED.name, 
        updated_at = NOW();
    `;
    
    await pool.query(query, [id, email, role || 'user', name]);
    
    logger.info(`User synced: ${id} (${email})`);
    res.json({ message: "User synced successfully" });
  } catch (error) {
    next(error); 
  }
};

exports.getCurrentUser = async (req, res, next) => {
  const id = req.user.id;

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const user = userResult.rows[0];
    let farm = null;

    if (user.role === "vendor") {
      const farmResult = await pool.query(
        "SELECT * FROM farms WHERE owner_id = $1",
        [id]
      );
      farm = farmResult.rows[0] || null;
    }

    res.json({ ...user, farm });
  } catch (error) {
    next(error);
  }
};