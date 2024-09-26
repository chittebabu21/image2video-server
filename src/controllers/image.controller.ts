// imports 
import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import * as ImageService from '../services/image.service';

// configurations
dotenv.config();

// controller methods
export const findAll = async (req: Request, res: Response): Promise<Response> => {
    try {
        const images = await ImageService.findAll();

        if (!images || images.length === 0) {
            return res.status(400).json({
                success: 0,
                message: 'Images not found...'
            });
        }

        return res.status(200).json({
            success: 1,
            data: images
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

        const image = await ImageService.findById(parseInt(id));

        if (!image) {
            return res.status(400).json({
                success: 0,
                message: 'Image not found...'
            });
        }

        return res.status(200).json({
            success: 1,
            data: image
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

export const findByUserId = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.id;

        const images = await ImageService.findByUserId(parseInt(id));

        if (!images) {
            return res.status(400).json({
                success: 0,
                message: `Images for user with user id ${id} not found...`
            });
        }

        return res.status(200).json({
            success: 1,
            data: images
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

        if (!body.user_id) {
            return res.status(400).json({
                success: 0,
                message: 'User id is required...'
            });
        }

        if (req.file) {
            const imageUrl = req.file.filename;
            body.image_url = imageUrl;
        }

        const image = await ImageService.create(body);

        if (!image) {
            return res.status(400).json({
                success: 0,
                message: 'Unable to create image...'
            }); 
        }

        return res.status(200).json({
            success: 1,
            data: image
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

        if (req.file) {
            const imageUrl = req.file.filename;
            body.image_url = imageUrl;
        }

        const existingImage = await ImageService.findById(parseInt(id));

        if (!existingImage) {
            return res.status(400).json({
                success: 0,
                message: `Image with id ${id} not found...`
            });
        }

        const image = await ImageService.update(parseInt(id), body);

        if (!image) {
            return res.status(400).json({
                success: 0,
                message: 'Unable to update image...'
            });
        }

        return res.status(200).json({
            success: 1,
            data: image
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

        const existingImage = await ImageService.findById(parseInt(id));

        if (!existingImage) {
            return res.status(400).json({
                success: 0,
                message: `Image with id ${id} not found...`
            });
        }

        await ImageService.remove(parseInt(id));

        return res.status(200).json({
            success: 1,
            message: 'Image removed successfully!'
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