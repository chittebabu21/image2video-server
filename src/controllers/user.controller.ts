// imports 
import { Request, Response } from 'express';
import brcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { randomBytes } from 'node:crypto';
import * as jwt from 'jsonwebtoken';
import * as UserService from '../services/user.service';

// configurations
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Hotmail',
    auth: {
        user: process.env.TRANSPORT_EMAIL,
        pass: process.env.TRANSPORT_PASSWORD
    }
});

// controller methods
export const findAll = async (req: Request, res: Response): Promise<Response> => {
    try {
        const users = await UserService.findAll();

        if (!users || users.length === 0) {
            return res.status(400).json({
                success: 0,
                message: 'Users not found...'
            });
        }

        return res.status(200).json({
            success: 1,
            data: users
        });
    } catch (err) {
        const error = err as Error;
        console.log(error);

        return res.status(500).json({
            success: 0,
            error: error.message
        });
    }
}

export const findById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.id;

        const user = await UserService.findById(parseInt(id));

        if (!user) {
            return res.status(400).json({
                success: 0,
                message: 'User not found...'
            }); 
        }

        return res.status(200).json({
            success: 1,
            data: user
        });
    } catch (err) {
        const error = err as Error;
        console.log(error);

        return res.status(500).json({
            success: 0, 
            error: error.message
        });
    }
}

export const findByEmailAddress = async (req: Request, res: Response): Promise<Response> => {
    try {
        const emailAddress = req.query.email_address;

        const user = await UserService.findByEmailAddress(emailAddress as string);

        if (!user) {
            return res.status(400).json({
                success: 0,
                message: 'User not found...'
            }); 
        }

        return res.status(200).json({
            success: 1,
            data: user
        });
    } catch (err) {
        const error = err as Error;
        console.log(error);

        return res.status(500).json({
            success: 0, 
            error: error.message
        });
    }
}

export const create = async (req: Request, res: Response): Promise<Response> => {
    try {
        const body = req.body;

        const existingUser = await UserService.findByEmailAddress(body.email_address);

        if (existingUser) {
            return res.status(409).json({
                success: 0,
                message: 'User with email address already exists...'
            });
        }

        const hash = await brcrypt.hash(body.password_hash, 10);

        if (!hash) {
            return res.status(400).json({
                success: 0,
                message: 'Unable to encrypt password...'
            });
        }

        const user = await UserService.create({ email_address: body.email_address, password_hash: hash });

        if (!user) {
            return res.status(400).json({
                success: 0,
                message: 'Unable to create user...'
            }); 
        }

        return res.status(200).json({
            success: 1,
            data: user
        });
    } catch (err) {
        const error = err as Error;
        console.log(error);

        return res.status(500).json({
            success: 0, 
            error: error.message
        });
    }
}

export const update = async (req: Request, res: Response): Promise<Response> => {
    try {
        const body = req.body;
        const id = req.params.id;

        const existingUser = await UserService.findById(parseInt(id));

        if (!existingUser) {
            return res.status(400).json({
                success: 0,
                message: `User with id ${id} not found...`
            });
        }

        if (req.file) {
            const imageUrl = req.file.filename;
            body.profile_image_url = imageUrl;
        }

        if (body.password_hash) {
            const hash = await brcrypt.hash(body.password_hash, 10);

            if (!hash) {
                return res.status(400).json({
                    success: 0,
                    message: 'Unable to encrypt password...'
                });
            }

            body.password_hash = hash;
        }

        const user = await UserService.update(parseInt(id), body);

        if (!user) {
            return res.status(400).json({
                success: 0,
                message: 'Unable to update user...'
            }); 
        }

        return res.status(200).json({
            success: 1,
            data: user
        });
    } catch (err) {
        const error = err as Error;
        console.log(error);

        return res.status(500).json({
            success: 0, 
            error: error.message
        });
    }
}

export const updatePassword = async (req: Request, res: Response): Promise<Response> => {
    try {
        const body = req.body;

        if (!body || !body.email_address || !body.password_hash) {
            return res.status(400).json({
                success: 0,
                message: 'Email address & password are required...'
            });
        }

        const user = await UserService.findByEmailAddress(body.email_address);

        if (!user) {
            return res.status(400).json({
                success: 0,
                message: 'Unable to find user...'
            }); 
        }

        const hash = await brcrypt.hash(body.password_hash, 10);

        if (!hash) {
            return res.status(400).json({
                success: 0,
                message: 'Unable to encrypt password...'
            });
        }

        body.password_hash = hash;

        const updatedUser = await UserService.update(user.user_id, { password_hash: body.password_hash, reset_password_token: null });

        if (!updatedUser) {
            return res.status(400).json({
                success: 0,
                message: 'Unable to update password...'
            });
        }

        return res.status(200).json({
            success: 1,
            data: updatedUser
        });
    } catch (err) {
        const error = err as Error;
        console.log(error);

        return res.status(500).json({
            success: 0, 
            error: error.message
        });
    }
}

export const remove = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.id;

        const user = await UserService.findById(parseInt(id));

        if (!user) {
            return res.status(400).json({
                success: 0,
                message: 'User not found...'
            }); 
        }

        await UserService.remove(parseInt(id));

        return res.status(200).json({
            success: 1,
            message: 'User removed successfully!'
        });
    } catch (err) {
        const error = err as Error;
        console.log(error);

        return res.status(500).json({
            success: 0, 
            error: error.message
        });
    }
}

export const login = async (req: Request, res: Response): Promise<Response> => {
    try {
        const body = req.body;

        const user = await UserService.findByEmailAddress(body.email_address);

        if (!user) {
            return res.status(400).json({
                success: 0,
                message: 'User not found...'
            }); 
        }

        const passwordMatch = await brcrypt.compare(body.password_hash, user.password_hash);

        if (passwordMatch) {
            const token = jwt.sign(body, process.env.JWT_SECRET as string, {
                expiresIn: '48h'
            });

            // update last login date time
            const loggedInUser = await UserService.update(user.user_id, { last_login: new Date() });

            return res.status(200).json({
                success: 1, 
                message: 'User logged in successfully!',
                token: token,
                data: loggedInUser
            });
        }

        return res.status(401).json({
            success: 0, 
            message: 'Invalid password...'
        });

    } catch (err) {
        const error = err as Error;
        console.log(error);

        return res.status(500).json({
            success: 0, 
            error: error.message
        });
    }
}

export const sendResetPasswordLink = async (req: Request, res: Response): Promise<Response> => {
    try {
        const body = req.body;

        if (!body.email_address) {
            return res.status(400).json({
                success: 0,
                message: 'Email address is required...'
            });
        }

        const user = await UserService.findByEmailAddress(body.email_address);

        if (!user) {
            return res.status(400).json({
                success: 0,
                message: 'User not found...'
            }); 
        }

        const resetPasswordToken = randomBytes(10).toString('hex');

        const updatedUser = await UserService.update(user.user_id, { reset_password_token: resetPasswordToken });

        if (!updatedUser) {
            return res.status(400).json({
                success: 0,
                message: 'User failed to be updated...'
            });
        }

        const resetPasswordLink = `${process.env.RESET_PASSWORD_LINK}/${resetPasswordToken}`;

        const message = `
            <h1>Image2Video</h1>
            <h4>Click on the link below to reset your password</h4>
            <a href="${resetPasswordLink}">RESET MY PASSWORD</a>
        `;

        const info = transporter.sendMail({
            from: process.env.TRANSPORT_EMAIL,
            to: updatedUser.email_address,
            subject: 'Reset Password Request',
            html: message
        });

        if (!info) {
            return res.status(500).json({
                success: 0,
                message: 'Failed to send reset password link...'
            });
        }

        return res.status(200).json({
            success: 1,
            message: `Reset password link sent to ${updatedUser.email_address} successfully!`,
            info: info
        });
    } catch (err) {
        const error = err as Error;
        console.log(error);

        return res.status(500).json({
            success: 0, 
            error: error.message
        });
    }
}

export const sendVerificationLink = async (req: Request, res: Response): Promise<Response> => {
    try {
        const body = req.body;

        if (!body.email_address) {
            return res.status(400).json({
                success: 0,
                message: 'Email address is required...'
            });
        }

        const user = await UserService.findByEmailAddress(body.email_address);

        if (!user) {
            return res.status(400).json({
                success: 0,
                message: 'User not found...'
            }); 
        }

        const verificationToken = randomBytes(20).toString('hex');

        const updatedUser = await UserService.update(user.user_id, { verification_token: verificationToken });

        if (!updatedUser) {
            return res.status(400).json({
                success: 0,
                message: 'User failed to be updated...'
            });
        }

        const verificationLink = `${process.env.VERIFICATION_LINK}/${verificationToken}`;

        const message = `
            <h1>Image2Video</h1>
            <h4>Click on the link below to verify your email</h4>
            <a href="${verificationLink}">VERIFY MY EMAIL</a>
        `;

        const info = transporter.sendMail({
            from: process.env.TRANSPORT_EMAIL,
            to: updatedUser.email_address,
            subject: 'Email Verification Request',
            html: message
        });

        if (!info) {
            return res.status(500).json({
                success: 0,
                message: 'Failed to send verification link...'
            });
        }

        return res.status(200).json({
            success: 1,
            message: `Verification link sent to ${updatedUser.email_address} successfully!`,
            info: info
        });
    } catch (err) {
        const error = err as Error;
        console.log(error);

        return res.status(500).json({
            success: 0, 
            error: error.message
        });
    }
}

export const verifyEmail = async (req: Request, res: Response): Promise<Response> => {
    try {
        const token = req.params.token;

        const user = await UserService.findByVerificationToken(token);

        if (!user) {
            return res.status(400).json({
                success: 0,
                message: 'User not found...'
            }); 
        }

        const verifiedUser = await UserService.update(user.user_id, { is_verified: 1, verification_token: null });

        if (!verifiedUser) {
            return res.status(400).json({
                success: 0,
                message: 'Failed to verify user...'
            });
        }

        return res.status(200).json({
            success: 1,
            data: verifiedUser
        });
    } catch (err) {
        const error = err as Error;
        console.log(error);

        return res.status(500).json({
            success: 0, 
            error: error.message
        });
    }
}