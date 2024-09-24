// imports
import { pool } from "../dao/dao";
import { Image } from "../interfaces/image.interface";
import { MysqlError } from "../interfaces/mysql-error.interface";
import { RowDataPacket } from "mysql2";

// service methods
export const findAll = async (): Promise<Image[] | null> => {
    try {
        const [rows] = await pool.query('SELECT * FROM images');
        return rows as Image[];
    } catch (err: any) {
        const mysqlError = err as MysqlError;
        console.log(`Error in fetching images: ${mysqlError.message}`);
        return null;
    } 
}

export const findById = async (id: number): Promise<Image | null> => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM images WHERE image_id = ?', [id]);
        return rows.length ? (rows[0] as Image) : null;
    } catch (err: any) {
        const mysqlError = err as MysqlError;
        console.log(`Error in fetching image: ${mysqlError.message}`);
        return null;
    } 
}

export const findByUserId = async (id: number): Promise<Image[] | null> => {
    try {
        const [rows] = await pool.query('SELECT * FROM images WHERE user_id = ?', [id]);
        return rows as Image[];
    } catch (err: any) {
        const mysqlError = err as MysqlError;
        console.log(`Error in fetching images: ${mysqlError.message}`);
        return null;
    } 
}

export const create = async (newImage: { image_url: string; image_size?: string | null; user_id: number }): Promise<Image | null> => {
    try {
        const [result] = await pool.query<RowDataPacket[]>(
            'INSERT INTO images (image_url, image_size, user_id) VALUES (?, ?, ?)',
            [newImage.image_url, newImage.image_size, newImage.user_id]
        );
        console.log(result);

        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM images WHERE image_id = LAST_INSERT_ID()');
        return rows.length ? (rows[0] as Image) : null;
    } catch (err: any) {
        const mysqlError = err as MysqlError;
        console.log(`Error in creating new image: ${mysqlError.message}`);
        return null;
    } 
}

export const update = async (id: number, imageUpdate: { image_size: string | null }): Promise<Image | null> => {
    try {
        const [result] = await pool.query<RowDataPacket[]>('UPDATE images SET image_size = ? WHERE image_id = ?', [imageUpdate.image_size, id]);
        console.log(result);

        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM images WHERE image_id = ?', [id]);
        return rows.length ? (rows[0] as Image) : null;
    } catch (err: any) {
        const mysqlError = err as MysqlError;
        console.log(`Error in updating image: ${mysqlError.message}`);
        return null;
    } 
}

export const remove = async (id: number): Promise<null | void> => {
    try {
        await pool.query('DELETE FROM images WHERE image_id = ?', [id]);
        return;
    } catch (err) {
        const mysqlError = err as MysqlError;
        console.log(`Error in removing image: ${mysqlError.message}`);
        return null;
    }
}