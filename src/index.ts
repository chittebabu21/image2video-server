// imports
import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import * as dotenv from 'dotenv';
import helmet from 'helmet';

import { UserRouter } from './routes/user.route';
import { VideoRouter } from './routes/video.route';
import { DownloadRouter } from './routes/download.route';

dotenv.config();

// variables
if (!process.env.PORT) {
    process.exit(1);
}

const port: number = parseInt(process.env.PORT, 10);
const app = express();

// configurations
app.use(express.json());
// app.use(helmet());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// static sites
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'), {
    setHeaders: (res, path, stat) => {
        res.set('Access-Control-Allow-Origin', 'http://localhost:8100');
    }
}));

// html sites
app.get('/image2video/verify_email/:token', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', 'verify-email.html'));
});
app.get('/image2video/reset_password/:token', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', 'reset-password.html'));
});

// routes
app.use('/api/users', UserRouter);
app.use('/api/videos', VideoRouter);
app.use('/api/downloads', DownloadRouter);

// activate server
app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});