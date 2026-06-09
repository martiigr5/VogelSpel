import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server draait op http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`)
});