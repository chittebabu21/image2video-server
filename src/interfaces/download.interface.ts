// imports 
import { Video } from "./video.interface";

// download interface
export interface Download {
    download_id: number;
    payment_status?: string;
    price?: number;
    downloaded_on: Date;
    video_id: number;
    video?: Video
}