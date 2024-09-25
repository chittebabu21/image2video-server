// imports
import { Image } from "./image.interface";

// video interface
export interface Video {
    video_id: number;
    video_url: string;
    generation_id: string;
    generated_on: Date;
    image_id: number;
    image?: Image;
}