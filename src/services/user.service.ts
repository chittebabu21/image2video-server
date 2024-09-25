// imports
import { pool } from '../dao/dao';
import { User } from '../interfaces/user.interface';
import { MysqlError } from '../interfaces/mysql-error.interface';
import { RowDataPacket } from 'mysql2';


// service methods
export const findAll = async (): Promise<User[] | null> => {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        return rows as User[];
    } catch (err: any) {
        const mysqlError = err as MysqlError;
        console.log(`Error in fetching users: ${mysqlError.message}`);
        return null;
    }
}

export const findById = async (id: number): Promise<User | null> => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE user_id = ?', [id]);
        return rows.length ? (rows[0] as User) : null;
    } catch (err: any) {
        const mysqlError = err as MysqlError;
        console.log(`Error in fetching user: ${mysqlError.message}`);
        return null;
    }
}

export const findByEmailAddress = async (email_address: string): Promise<User | null> => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE email_address = ?', [email_address]);
        return rows.length ? (rows[0] as User) : null;
    } catch (err) {
        const mysqlError = err as MysqlError;
        console.log(`Error in fetching user: ${mysqlError.message}`);
        return null;
    }
}

export const findByVerificationToken = async (verification_token: string): Promise<User | null> => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE verification_token = ?', [verification_token]);
        return rows.length ? (rows[0] as User) : null;
    } catch (err) {
        const mysqlError = err as MysqlError;
        console.log(`Error in fetching user: ${mysqlError.message}`);
        return null;
    }
}

export const create = async (newUser: { email_address: string; password_hash: string; }): Promise<User | null> => {
    try {
        const [result] = await pool.query<RowDataPacket[]>(
            'INSERT INTO users (email_address, password_hash) VALUES (?, ?)',
            [newUser.email_address, newUser.password_hash]
        );

        // get the inserted row by id
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE user_id = LAST_INSERT_ID()');
        return rows.length ? (rows[0] as User) : null;
    } catch (err) {
        const mysqlError = err as MysqlError;
        console.log(`Error in creating new user: ${mysqlError.message}`);
        return null;
    }
}

export const update = async (
    id: number, 
    userUpdate: { 
        password_hash?: string; 
        profile_image_url?: string | null; 
        verification_token?: string | null;
        reset_password_token?: string | null;
        is_verified?: 0 | 1; 
        updated_on?: Date; 
        last_login?: Date }
    ): Promise<User | null> => {
    try {
        // build dynamic query based on fields which are updated
        let query = 'UPDATE users SET ';
        const fields: any[] = [];

        if (userUpdate.password_hash) {
            query += 'password_hash = ?, ';
            fields.push(userUpdate.password_hash);
        }

        if (userUpdate.profile_image_url !== undefined) {
            query += 'profile_image_url = ?, ';
            fields.push(userUpdate.profile_image_url);
        }

        if (userUpdate.verification_token !== undefined) {
            query += 'verification_token = ?, ';
            fields.push(userUpdate.verification_token);
        }

        if (userUpdate.reset_password_token !== undefined) {
            query += 'reset_password_token = ?, ';
            fields.push(userUpdate.reset_password_token);
        }

        if (userUpdate.is_verified !== undefined) {
            query += 'is_verified = ?, ';
            fields.push(userUpdate.is_verified);
        }

        query += 'updated_on = NOW(), ';

        if (userUpdate.last_login) {
            query += 'last_login = ?, ';
            fields.push(userUpdate.last_login);
        }

        query = query.slice(0, -2); // remove trailing commas
        query += ' WHERE user_id = ?';
        fields.push(id);

        await pool.query(query, fields);

        // fetch updated user details
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE user_id = ?', [id]);
        return rows.length ? (rows[0] as User) : null;
    } catch (err) {
        const mysqlError = err as MysqlError;
        console.log(`Error in updating user: ${mysqlError.message}`);
        return null;
    }
}

export const remove = async (id: number): Promise<null | void> => {
    try {
        await pool.query('DELETE FROM users WHERE user_id = ?', [id]);
        return;
    } catch (err) {
        const mysqlError = err as MysqlError;
        console.log(`Error in removing user: ${mysqlError.message}`);
        return null;
    }
}