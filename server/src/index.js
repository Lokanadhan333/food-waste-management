import app from './app.js';
import env from './config/env.js';
import { connectDatabase } from './config/db.js';

async function start() {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(`FoodShare API running on http://localhost:${env.port}`);
    console.log(`Allowed frontend origin: ${env.clientUrl}`);
  });
}

start().catch((error) => {
  console.error('Failed to start the server:', error);
  process.exit(1);
});
