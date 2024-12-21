import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'brutalist_dev',
    user: process.platform === 'darwin' ? process.env.USER : 'postgres',
  },
  migrations: {
    directory: join(__dirname, '../database/migrations')
  },
  debug: true
};

export default config;