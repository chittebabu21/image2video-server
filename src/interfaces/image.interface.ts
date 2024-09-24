import { User } from "./user.interface";

// image interface
export interface Image {
    image_id: number;
    image_url: string;
    image_size?: string | null;
    added_on: Date | null; 
    user_id: number;
    user?: User;
}