import { Pool } from 'pg';
import dotenv from 'dotenv';

// laad de variabelen uit het .env bestand zoals de Host en Pool
dotenv.config();

// maakt een connection pool aan in plaats van losse verbindingen per query
const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// wanneer er een nieuwe fysieke verbinding opend, wordt deze getriggerd.
pool.on('connect', () => {
    console.log('verbonden met Postgresql database');
});

// vangt fouten op verbindingsniveau, zoals als de database wegvalt.
// process.exit(1); stopt de hele backend.
pool.on('error', (err) => {
    console.error('Database fout:', err);
    process.exit(1);
});

// exporteerd de pool voor alle routes.
export default pool;