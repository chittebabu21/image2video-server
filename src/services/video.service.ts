// imports
import { pool } from "../dao/dao";
import { Video } from "../interfaces/video.interface";
import { MysqlError } from "../interfaces/mysql-error.interface";
import { RowDataPacket } from "mysql2";

// service methods
export const findAll = async (): Promise<Video[] | null> => {
    try {
        const [rows] = await pool.query('SELECT * FROM videos');
        return rows as Video[];
    } catch (err: any) {
        const mysqlError = err as MysqlError;
        console.log(`Error in fetching videos: ${mysqlError.message}`);
        return null;
    }
}

export const findById = async (id: number): Promise<Video | null> => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM videos WHERE video_id = ?', [id]);
        return rows.length ? (rows[0] as Video) : null;
    } catch (err: any) {
        const mysqlError = err as MysqlError;
        console.log(`Error in fetching video: ${mysqlError.message}`);
        return null;
    }
}

export const findByImageId = async (id: number): Promise<Video[] | null> => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM videos WHERE image_id = ?', [id]);
        return rows as Video[];
    } catch (err: any) {
        const mysqlError = err as MysqlError;
        console.log(`Error in fetching videos: ${mysqlError.message}`);
        return null;
    }
}

export const findByImageIdWithUser = async (id: number): Promise<any | null> => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM videos LEFT JOIN images ON videos.image_id = images.image_id LEFT JOIN users ON images.user_id = users.user_id WHERE videos.image_id = ?',
            [id]
        );
        return rows;
    } catch (err: any) {
        const mysqlError = err as MysqlError;
        console.log(`Error in fetching video: ${mysqlError.message}`);
        return null;
    }
}

export const create = async (newVideo: { video_url: string; generation_id: string; image_id: number; }): Promise<Video | null> => {
    try {
        const [result] = await pool.query<RowDataPacket[]>(
            'INSERT INTO videos (video_url, generation_id, image_id) VALUES (?, ?, ?)',
            [newVideo.video_url, newVideo.generation_id, newVideo.image_id]
        );
        console.log(result);

        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM videos WHERE video_id = LAST_INSERT_ID()');
        return rows.length ? (rows[0] as Video) : null;
    } catch (err: any) {
        const mysqlError = err as MysqlError;
        console.log(`Error in creating new video: ${mysqlError.message}`);
        return null;
    }
}

export const remove = async (id: number): Promise<null | void> => {
    try {
        await pool.query('DELETE FROM videos WHERE video_id = ?', [id]);
        return;
    } catch (err) {
        const mysqlError = err as MysqlError;
        console.log(`Error in removing video: ${mysqlError.message}`);
        return null;
    }
}