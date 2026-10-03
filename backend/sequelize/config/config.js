const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from `.env` if present.
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  development: {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'musify',
    password: process.env.DB_PASSWORD || 'musify_secret',
    database: process.env.DB_NAME || 'musify_clone',
    logging: false,
  },
  test: {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'musify',
    password: process.env.DB_PASSWORD || 'musify_secret',
    database: process.env.DB_NAME || 'musify_clone',
    logging: false,
  },
  production: {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'musify',
    password: process.env.DB_PASSWORD || 'musify_secret',
    database: process.env.DB_NAME || 'musify_clone',
    logging: false,
  },
};

