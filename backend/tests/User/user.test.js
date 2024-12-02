const request = require('supertest');
const express = require('express');
const router = require('../../routes/index.js');
const UserModel = require('../../database/models/user.model.js');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(router);

describe('user', () => {
    it('POST 200 Create user', async() => {
        await request(app)
            .post('/api/user/add')
            .send({ email: 'test@example.com', password: 'password123', name:"John Doe" })
            .expect(200);
        
            const userFound = await UserModel.findOne({ email: 'test@example.com' });
            expect(userFound.name).toBe('John Doe');
    })

    it('POST 400 Create user already exists', async() => {
        await UserModel.create({email: 'test@example.com', password: await bcrypt.hash('test', 8)});
        const res = await request(app)
            .post('/api/user/add')
            .send({ email: 'test@example.com', password: 'password123', name:"John Doe" })
            .expect(400);
        
        expect(res.body).toEqual('Un compte avec cet email exist déjà!');
    })

    // Correction code TODO
    // it('POST 400 Create user with a password with 4 char', async() => {

    //     const res = await request(app)
    //         .post('/api/user/add')
    //         .send({ email: 'test@example.com', password: '1234', name:"John Doe" })
    //         .expect(400);
        
    //         expect(res.body).toEqual('Le mot de passe fait moins de 8 carctères');
    // })
})