// imports
import request, { Response } from "supertest";
import express from 'express';
import { UserRouter } from "../routes/user.route";

// configurations
const app = express();
app.use(express.json());
app.use('/api/users', UserRouter);

// test methods
describe('User API Endpoints', () => {
    it('GET /api/users should return all users', async () => {
        const response: Response = await request(app)
            .get('/api/users')
            .expect(200);

        expect(response.body).toBeInstanceOf(Object);
    });

    it('GET /api/users/:id should return user if exists', async () => {
        const response: Response = await request(app)
            .get('/api/users/3')
            .expect(200);

        expect(response.body).toHaveProperty('data.user_id');
    });

    it('GET /api/users/user should return user if exists', async () => {
        const response: Response = await request(app)
            .get('/api/users/user?email_address=giant@mail.com')
            .expect(200);

        expect(response.body.data).toHaveProperty('email_address');
    });

    it('POST /api/users should create a new user', async () => {
        const newUser = {
            email_address: 'test-6@email.com',
            password_hash: 'Singapore25'
        };

        const response: Response = await request(app)
            .post('/api/users')
            .send(newUser)
            .expect(200);

        expect(response.body).toHaveProperty('data.user_id');
        expect(response.body.data.email_address).toBe(newUser.email_address);
    });
});