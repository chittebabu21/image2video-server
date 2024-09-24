// imports
import express from 'express';
import { userAuth } from '../auth/user.auth';
import { upload } from '../auth/upload.auth';
import * as ImageController from '../controllers/image.controller';

// router configuration
export const ImageRouter = express.Router();

// routes
ImageRouter.get('/user/:id', userAuth, ImageController.findByUserId);
ImageRouter.get('/:id', userAuth, ImageController.findById);
ImageRouter.get('/', userAuth, ImageController.findAll);
ImageRouter.post('/', userAuth, upload.single('image_url'), ImageController.create);
ImageRouter.put('/:id', userAuth, ImageController.update);
ImageRouter.delete('/:id', ImageController.remove);