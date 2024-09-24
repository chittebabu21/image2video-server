// imports
import express from 'express';
import cors from 'cors';
import path from 'path';
import * as dotenv from 'dotenv';
import helmet from 'helmet';

import { UserRouter } from './routes/user.route';
import { ImageRouter } from './routes/image.route';

dotenv.config();

// variables
if (!process.env.PORT) {
    process.exit(1);
}

const port: number = parseInt(process.env.PORT, 10);
const app = express();

// configurations
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(express.static(path.join(__dirname, '..', 'uploads', 'images')));
app.use(express.static(path.join(__dirname, '..', 'uploads', 'videos')));

app.use('/api/users', UserRouter);
app.use('/api/images', ImageRouter);

// activate server
app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});