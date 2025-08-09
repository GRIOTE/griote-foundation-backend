const { Pool } = require('pg');
require('dotenv').config();
//informations necessaires pour la connexion a la base de donnée
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT
});

module.exports = pool;
