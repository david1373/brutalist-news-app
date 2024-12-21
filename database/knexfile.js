import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const development = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'brutalist_dev',
    user: process.env.DB_USER || (process.platform === 'darwin' ? process.env.USER : 'postgres'),
  },
  migrations: {
    directory: join(__dirname, 'migrations'),
  },
  seeds: {
    directory: join(__dirname, 'seeds'),
  },
  debug: true
};

const production = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: join(__dirname, 'migrations'),
  },
  seeds: {
    directory: join(__dirname, 'seeds'),
  },
  pool: {
    min: 2,
    max: 10,
  },
};

const config = process.env.NODE_ENV === 'production' ? production : development;

export default config;