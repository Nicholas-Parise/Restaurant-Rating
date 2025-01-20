const { Pool } = require('pg');

const pool = new Pool({
  user: 'your_username',
  password: 'your_password',
  host: 'localhost',
  port: 5432, // default Postgres port
  database: 'fooddb'
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};