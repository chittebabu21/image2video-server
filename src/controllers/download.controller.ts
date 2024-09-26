// imports 
import { Request, Response } from 'express';
import * as DownloadService from '../services/download.service';

// controller methods
export const findAll = async (req: Request, res: Response): Promise<Response> => {
    try {
        const downloads = await DownloadService.findAll();

        if (!downloads || downloads.length === 0) {
            return res.status(400).json({
                success: 0,
                message: 'Downloads not found...'
            });
        }

        return res.status(200).json({
            success: 1,
            data: downloads
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

        const download = await DownloadService.findById(parseInt(id));

        if (!download) {
            return res.status(400).json({
                success: 0,
                message: 'Download not found...'
            });
        }

        return res.status(200).json({
            success: 1,
            data: download
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

export const findByVideoId = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.id;

        const download = await DownloadService.findByVideoId(parseInt(id));

        if (!download) {
            return res.status(400).json({
                success: 0,
                message: 'Download not found...'
            });
        }

        return res.status(200).json({
            success: 1,
            data: download
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

        if (!body.video_id) {
            return res.status(400).json({
                success: 0,
                message: 'Video id is required...'
            });
        }

        const download = await DownloadService.create(body);

        if (!download) {
            return res.status(400).json({
                success: 0,
                message: 'Unable to create download...'
            });
        }

        return res.status(200).json({
            success: 0,
            data: download
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

export const update = async (req: Request, res: Response): Promise<Response> =>{
    try {
        const body = req.body;
        const id = req.params.id;

        const existingDownload = await DownloadService.findById(parseInt(id));

        if (!existingDownload) {
            return res.status(400).json({
                success: 0,
                message: 'Download not found...'
            });
        }

        const download = await DownloadService.update(parseInt(id), body);

        if (!download) {
            return res.status(400).json({
                success: 0,
                message: 'Unable to update download...'
            });
        }

        return res.status(200).json({
            success: 1,
            data: download
        });
    }  catch (err) {
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

        const existingDownload = await DownloadService.findById(parseInt(id));

        if (!existingDownload) {
            return res.status(400).json({
                success: 0,
                message: 'Download not found...'
            });
        }

        await DownloadService.remove(parseInt(id));

        return res.status(200).json({
            success: 1,
            message: 'Download removed successfully!'
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