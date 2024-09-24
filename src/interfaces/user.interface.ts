// user interface
export interface User {
    user_id: number;
    email_address: string;
    password_hash: string;
    profile_image_url: string | null;
    verification_token: string | null;
    reset_password_token: string | null;
    is_verified: 0 | 1;
    created_on: Date;
    updated_on: Date | null;
    last_login: Date | null;
}