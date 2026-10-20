import dotenv from 'dotenv';

dotenv.config();

const env = {
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: (process.env.MONGODB_URI || '').trim(),
};

// Treat placeholder values as "no database configured".
if (
  !env.mongoUri ||
  env.mongoUri === 'your_mongodb_connection_string' ||
  env.mongoUri === 'your_connection_string'
) {
  env.mongoUri = '';
}

export default env;
