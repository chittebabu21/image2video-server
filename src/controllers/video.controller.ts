// imports
import { Request, Response } from 'express';
import fs from 'node:fs';
import sharp from 'sharp';
import path from 'path';
import axios, { AxiosResponse } from 'axios';
import FormData from 'form-data';
import * as dotenv from 'dotenv';
import * as VideoService from '../services/video.service';

// configurations
dotenv.config();

// controller methods
export const findAll = async (req: Request, res: Response): Promise<Response> => {
    try {
        const videos = await VideoService.findAll();

        if (!videos || videos.length === 0) {
            return res.status(400).json({
                success: 0,
                message: 'Videos not found...'
            });
        }

        return res.status(200).json({
            success: 1,
            data: videos
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

        const video = await VideoService.findById(parseInt(id));

        if (!video) {
            return res.status(400).json({
                success: 0,
                message: 'Video not found...'
            });
        }

        return res.status(200).json({
            success: 1,
            data: video
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

        const videos = await VideoService.findByUserId(parseInt(id));

        if (!videos) {
            return res.status(400).json({
                success: 0,
                message: 'Videos not found...'
            });
        }

        return res.status(200).json({
            success: 1,
            data: videos
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

export const getGeneratedVideo = async (req: Request, res: Response): Promise<Response> => {
    try {
        const body = req.body;

        if (!body.generation_id || !body.user_id) {
            return res.status(400).json({
                success: 0,
                message: 'Parameters missing...'
            });
        }

        // Polling function to check video status
        const checkVideoStatus = async (): Promise<AxiosResponse> => {
            return axios.request({
                url: `${process.env.STABILITY_AI_URL}/result/${body.generation_id}`,
                method: 'GET',
                validateStatus: undefined,
                responseType: 'arraybuffer',
                headers: {
                    Authorization: `Bearer ${process.env.STABILITY_AI_API_KEY}`,
                    Accept: 'video/*'
                }
            });
        };

        let response: AxiosResponse;
        const MAX_RETRIES = 10; // Set a limit on retries to avoid endless polling
        const POLLING_INTERVAL = 5000; // 5 seconds between checks
        let retries = 0;

        // Poll the Stability API until we get a 200 status or hit the retry limit
        do {
            response = await checkVideoStatus();

            if (response.status === 202) {
                console.log('Video generation in progress, retrying...');
                await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL)); // Wait before retrying
                retries++;
            } else if (response.status === 200) {
                break; // Video is ready
            } else {
                return res.status(response.status).json({
                    success: 0,
                    error: `Response ${response.status}: ${response.data}`
                });
            }
        } while (retries < MAX_RETRIES);

        // If we exhausted retries and still have a 202 status, return an error
        if (response.status !== 200) {
            return res.status(500).json({
                success: 0,
                message: 'Video generation timed out or failed.'
            });
        }

        // Write the video to the file system
        const videoFilePath = `uploads/videos/${body.generation_id}.mp4`;
        fs.writeFileSync(videoFilePath, Buffer.from(response.data));

        // Create the video entry in the database
        const video = await VideoService.create({ 
            video_url: `${body.generation_id}.mp4`, 
            generation_id: body.generation_id,
            user_id: body.user_id
        });

        if (!video) {
            return res.status(400).json({
                success: 0,
                message: 'Unable to create video...'
            });
        }

        return res.status(200).json({
            success: 1,
            message: 'Video created successfully!',
            data: video
        });
    } catch (err) {
        const error = err as Error;
        console.error(error);

        return res.status(500).json({
            success: 0,
            error: error.message
        });
    }
};

export const generateVideo = async (req: Request, res: Response): Promise<Response> => {
    try {
        const body = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: 0,
                message: 'Image file is missing...'
            });
        }

        if (!body.width || !body.height) {
            return res.status(400).json({
                success: 0,
                message: 'Image parameters are missing...'
            });
        }

        console.log(req.file);

        const width = parseInt(body.width);
        const height = parseInt(body.height);

        const imagePath = path.join(__dirname, '..', '..', req.file.path);
        const resizedImagePath = path.join(__dirname, '..', '..', 'uploads', 'images', `resized-${req.file.filename}`);

        if (!fs.existsSync(path.join(__dirname, '..', '..', 'uploads', 'images'))) {
            fs.mkdirSync(path.join(__dirname, '..', '..', 'uploads', 'images'), { recursive: true });
        }

        await sharp(imagePath)
            .resize(width, height, { fit: 'cover' })
            .toFile(resizedImagePath);

        const data = new FormData();
        data.append('image', fs.readFileSync(resizedImagePath), `resized-${req.file.originalname}`);
        data.append('seed', 0);
        data.append('cfg_scale', 1.8);
        data.append('motion_bucket_id', 127);

        const response: AxiosResponse = await axios.request({
            url: process.env.STABILITY_AI_URL,
            method: 'POST',
            validateStatus: undefined,
            headers: {
                Authorization: `Bearer ${process.env.STABILITY_AI_API_KEY}`,
                ...data.getHeaders()
            },
            data: data
        });

        if (!response) {
            return res.status(502).json({
                success: 0,
                message: 'No response from AI server...'
            });
        }
        
        return res.status(200).json({
            success: 1,
            data: response.data
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

        const existingVideo = await VideoService.findById(parseInt(id));

        if (!existingVideo) {
            return res.status(400).json({
                success: 0, 
                message: 'Video not found...'
            });
        }

        // construct full path of video file
        const videoFilePath = path.join(__dirname, '../../uploads/videos', existingVideo.video_url);

        await VideoService.remove(parseInt(id));

        // check if file exist in videos folder and remove it
        if (fs.existsSync(videoFilePath)) {
            fs.unlinkSync(videoFilePath);
            console.log(`Video file ${videoFilePath} deleted successfully!`);
        } else {
            console.log(`Video file not found: ${videoFilePath}`);
        }

        return res.status(200).json({
            success: 1, 
            message: 'Video removed successfully!'
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