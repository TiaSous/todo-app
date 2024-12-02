const request = require('supertest');
const express = require('express');
const router = require('../../routes/index.js');
const UserModel = require('../models/user.model.js');

const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(router);

describe('Authentification', () => {
    it('POST 400 Connect with not valid credentials', async() => {
        const response = await request(app)
            .post('/api/auth')
            .send({ email: 'test@example.com', password: 'password123' })
            .expect(400);
        expect(response.body).toEqual('Utilisateur non trouvé');
    })
    it('POST 200 Connect with valid credentials', async() => {

        await UserModel.create({email: 'test@example.com', password: await bcrypt.hash('test', 8)})

        const response = await request(app)
            .post('/api/auth')
            .send({ email: 'test@example.com', password: 'test' })
            .expect(200);
    })
})