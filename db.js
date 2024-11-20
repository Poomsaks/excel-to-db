const mysql = require('mysql2');
require('dotenv').config();

if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME || !process.env.DB_PORT) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectionLimit: 100,
  waitForConnections: true,
  queueLimit: 0,
  connectTimeout: 10000,
  acquireTimeout: 10000,
});

const promisePool = pool.promise();

promisePool.execute('SELECT 1')
  .then(([rows, fields]) => {
    console.log('Database connected successfully');
  })
  .catch(err => {
    console.error('Database connection failed:', err.message);
  });

module.exports = promisePool;
