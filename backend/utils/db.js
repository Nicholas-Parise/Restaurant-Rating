const { Pool } = require('pg');
require("dotenv").config();

console.log("Database username:", process.env.DBUSERNAME);
console.log("Database URL:", process.env.PROD_HOST);
console.log("Database port:", process.env.DBPORT);
console.log("Database name:", process.env.DBNAME);

const pool = new Pool({
  /*
  user: process.env.DBUSERNAME,
  password: process.env.DBPASSWORD,
  host: process.env.PROD_HOST,
  port: process.env.DBPORT, // default Postgres port 5432
  database: process.env.DBNAME
  */
  connectionString: process.env.DATABASE_URL
});

async function connectWithRetry() {
  while (true) {
    try {
      await pool.query("SELECT 1;");
      console.log("Connected to database");
      break;
    } catch (err) {
      console.log("Database not ready, retrying...");
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

connectWithRetry();

module.exports = {
  query: (text, params) => pool.query(text, params)
};