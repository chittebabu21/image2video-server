// imports
import express from 'express';
import { userAuth } from '../auth/user.auth';
import * as DownloadController from '../controllers/download.controller';

// router configuration
export const DownloadRouter = express.Router();

// routes
DownloadRouter.get('/video/:id', userAuth, DownloadController.findByVideoId);
DownloadRouter.get('/:id', userAuth, DownloadController.findById);
DownloadRouter.get('/', userAuth, DownloadController.findAll);
DownloadRouter.post('/', userAuth, DownloadController.create);
DownloadRouter.put('/:id', userAuth, DownloadController.update);
DownloadRouter.delete('/:id', userAuth, DownloadController.remove);