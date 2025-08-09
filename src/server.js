import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './db.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectDB(process.env.MONGODB_URI);

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();
