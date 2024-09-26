// imports
import express from 'express';
import { userAuth } from '../auth/user.auth';
import { upload } from '../auth/upload.auth';
import * as VideoController from '../controllers/video.controller';

// router configuration
export const VideoRouter = express.Router();

// routes
VideoRouter.get('/image/user/:id', userAuth, VideoController.findByImageIdWithUser);
VideoRouter.get('/image/:id', userAuth, VideoController.findByImageId);
VideoRouter.get('/:id', userAuth, VideoController.findById);
VideoRouter.get('/', userAuth, VideoController.findAll);
VideoRouter.post('/generate', userAuth, upload.single('image'), VideoController.generateVideo);
VideoRouter.post('/', userAuth, VideoController.getGeneratedVideo);
VideoRouter.delete('/:id', userAuth, VideoController.remove);