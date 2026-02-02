const pool = require('../config/db');
const logger = require('../config/logger');

exports.searchFarms = async (req, res, next) => {
  const { lat, lng, radiusInKm } = req.body;
  const radiusMeters = (radiusInKm || 50) * 1000;

  try {
    const query = `
      SELECT id, name, products, status, type,
        ST_Distance(location, ST_MakePoint($1, $2)::geography) as dist_meters,
        ST_Y(location::geometry) as lat, 
        ST_X(location::geometry) as lng
      FROM farms
      WHERE ST_DWithin(location, ST_MakePoint($1, $2)::geography, $3)
      ORDER BY dist_meters ASC;
    `;
    
    const { rows } = await pool.query(query, [lng, lat, radiusMeters]);

    const results = rows.map((farm) => ({
      ...farm,
      distance: (farm.dist_meters / 1000).toFixed(1) + " km",
      lat: parseFloat(farm.lat),
      lng: parseFloat(farm.lng),
    }));

    res.json(results);
  } catch (error) {
    next(error); // Pass to global error handler
  }
};

exports.claimFarm = async (req, res, next) => {
  const { farmId } = req.params;
  const userId = req.user.id; 

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    const checkRes = await client.query(
      "SELECT type FROM farms WHERE id = $1 FOR UPDATE",
      [farmId]
    );

    if (checkRes.rows.length === 0) {
      throw new Error("Farm not found"); // Will be caught below
    }
    if (checkRes.rows[0].type !== "lead") {
      throw new Error("Farm already claimed");
    }

    await client.query(
      "UPDATE farms SET owner_id = $1, type = 'vendor', status = 'pending_verification' WHERE id = $2",
      [userId, farmId]
    );
    
    await client.query("UPDATE users SET role = 'vendor' WHERE id = $1", [userId]);
    
    await client.query("COMMIT");
    
    logger.info(`Farm ${farmId} claimed by user ${userId}`);
    res.json({ message: "Farm claimed successfully!" });

  } catch (error) {
    await client.query("ROLLBACK");
    
    if(error.message === "Farm not found") return res.status(404).json({error: error.message});
    if(error.message === "Farm already claimed") return res.status(409).json({error: error.message});
    
    next(error);
  } finally {
    client.release();
  }
};
