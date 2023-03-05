export default function handler(req, res) {
  const { lat, long } = req.query;
  const mysql = require("mysql2");
  const pool = mysql.createPool(process.env.DATABASE_URL, {
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
  });
  console.log("Connected to Database");
  if (req.method === "GET") {
    pool.query(`insert into coordinates (lat,long) values(${lat},${long})`);

    res
      .status(201)
      .json({
        coordinates: { lat, long },
        message: "value added successfully",
      });
    console.log(`lat:${lat},long:${long} added to the record`);
  }
}
