import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js'; 

dotenv.config({
    path: './.env' 
});

const PORT = process.env.PORT || 8000;

const startServer = async () => {
    try {
        await connectDB();
        
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });

    } catch (err) {
        console.error('Failed to start server:', err);
    }
};

startServer();