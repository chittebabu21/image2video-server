// imports
import { pool } from "../dao/dao";
import { Download } from "../interfaces/download.interface";
import { MysqlError } from "../interfaces/mysql-error.interface";
import { RowDataPacket } from "mysql2";

// service methods
export const findAll = async (): Promise<Download[] | null> => {
    try {
        const [rows] = await pool.query('SELECT * FROM downloads');
        return rows as Download[];
    } catch (err: any) {
        const mysqlError = err as MysqlError;
        console.log(`Error in fetching downloads: ${mysqlError.message}`);
        return null;
    }
}

export const findById = async (id: number): Promise<Download | null> => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM downloads WHERE download_id = ?', [id]);
        return rows.length ? (rows[0] as Download) : null;
    } catch (err: any) {
        const mysqlError = err as MysqlError;
        console.log(`Error in fetching download: ${mysqlError.message}`);
        return null;
    }
}

export const findByVideoId = async (id: number): Promise<Download[] | null> => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM downloads WHERE video_id = ?', [id]);
        return rows as Download[];
    } catch (err: any) {
        const mysqlError = err as MysqlError;
        console.log(`Error in fetching downloads: ${mysqlError.message}`);
        return null;
    }
}

export const create = async (newDownload: { payment_status?: string | null; price?: number | null; video_id: number }): Promise<Download | null> => {
    try {
        const [result] = await pool.query<RowDataPacket[]>(
            'INSERT INTO downloads (payment_status, price, video_id) VALUES (?, ?, ?)',
            [newDownload.payment_status, newDownload.price, newDownload.video_id]
        );
        console.log(result);

        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM downloads WHERE download_id = LAST_INSERT_ID()');
        return rows.length ? (rows[0] as Download) : null;
    } catch (err: any) {
        const mysqlError = err as MysqlError;
        console.log(`Error in creating new download: ${mysqlError.message}`);
        return null;
    }
}

export const update = async (id: number, downloadUpdate: { payment_status: string | null }): Promise<Download | null> => {
    try {
        const [result] = await pool.query<RowDataPacket[]>('UPDATE downloads SET payment_status = ? WHERE download_id = ?', [downloadUpdate.payment_status, id]);
        console.log(result);

        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM downloads WHERE download_id = ?', [id]);
        return rows.length ? (rows[0] as Download) : null;
    } catch (err: any) {
        const mysqlError = err as MysqlError;
        console.log(`Error in updating download: ${mysqlError.message}`);
        return null;
    }
}

export const remove = async (id: number): Promise<null | void> => {
    try {
        await pool.query('DELETE FROM downloads WHERE download_id = ?', [id]);
        return;
    } catch (err: any) {
        const mysqlError = err as MysqlError;
        console.log(`Error in removing download: ${mysqlError.message}`);
        return null;
    }
}