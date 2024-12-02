const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const UserModel = require('../../database/models/user.model');
const todoRouter = require('../../routes/todo.api.js');
const bcrypt = require('bcrypt');
const TodoModel = require('../../database/models/todo.model.js');
const cookieParser = require('cookie-parser');

jest.setTimeout(30000);

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use('/get', todoRouter);

describe('test', () => {

    it('test', async () => {
        await UserModel.create({email: 'test@example.com', password: await bcrypt.hash('test', 8)})

        const userFound = await UserModel.findOne({ email: 'test@example.com' });

        if (!userFound) {
            throw new Error('User not found');
        }

        const token = jwt.sign({}, require('../../env/keys'), {
            subject: userFound._id.toString(),
            expiresIn: 60 * 60 * 24 * 30 * 6,
            algorithm: 'RS256',
        })

        await TodoModel.create({text: 'test', completed: false, user_id: userFound._id.toString()});
        
        const response = request(app).get('/get').set('Cookie', `token=${token}`);
        
        expect((await response).status).toBe(200);

        expect((await response).body[0].text).toBe('test');
        expect((await response).body[0].completed).toBe(false);
        expect((await response).body[0].user_id).toEqual(userFound._id.toString());
        
    })
})