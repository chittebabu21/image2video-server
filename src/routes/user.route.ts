// imports
import express from 'express';
import { upload } from '../auth/upload.auth';
import { userAuth } from '../auth/user.auth';
import * as UserController from '../controllers/user.controller';

// router configuration
export const UserRouter = express.Router();

// routes
UserRouter.get('/verify_user/:token', UserController.verifyEmail);
UserRouter.get('/user/', UserController.findByEmailAddress);
UserRouter.get('/:id', UserController.findById);
UserRouter.get('/', UserController.findAll);
UserRouter.post('/reset_password_request', UserController.sendResetPasswordLink);
UserRouter.post('/verify_email_request', UserController.sendVerificationLink);
UserRouter.post('/oauth_user', UserController.createOAuthUser);
UserRouter.post('/login', UserController.login);
UserRouter.post('/', UserController.create);
UserRouter.put('/update_password', UserController.updatePassword);

// routes with authorization
UserRouter.post('/validate-password/:id', userAuth, UserController.comparePasswords);
UserRouter.put('/:id', userAuth, upload.single('profile_image_url'), UserController.update);
UserRouter.delete('/:id', userAuth, UserController.remove);