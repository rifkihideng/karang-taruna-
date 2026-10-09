import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import { initDb } from './src/db.js';

const PORT = process.env.PORT || 5000;

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server Karang Taruna berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Gagal menginisialisasi database:', err);
    process.exit(1);
  });
