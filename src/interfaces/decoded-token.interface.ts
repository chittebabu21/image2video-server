// imports
import { JwtPayload } from 'jsonwebtoken';
import { User } from './user.interface';

export interface DecodedToken extends JwtPayload {
    user: User;
}