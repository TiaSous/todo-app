const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const UserModel = require('../../database/models/user.model.js');
const todoRouter = require('../../routes/todo.api.js');
const bcrypt = require('bcrypt');
const TodoModel = require('../../database/models/todo.model.js');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/', todoRouter);

describe('Test for the todos', () => {

    it('Test to Get TODO from user', async () => {
        await UserModel.create({email: 'test@example.com', password: await bcrypt.hash('test', 8)})

        const userFound = await UserModel.findOne({ email: 'test@example.com' });

        if (!userFound) {
            throw new Error('User not found');
        }

        const token = jwt.sign({}, require('../../env/keys/index.js'), {
            subject: userFound._id.toString(),
            expiresIn: 60 * 60 * 24 * 30 * 6,
            algorithm: 'RS256',
        })

        await TodoModel.create({text: 'test', completed: false, user_id: userFound._id.toString()});
        
        const response = request(app).get('/').set('Cookie', `token=${token}`);
        
        expect((await response).status).toBe(200);

        expect((await response).body[0].text).toBe('test');
        expect((await response).body[0].completed).toBe(false);
        expect((await response).body[0].user_id).toEqual(userFound._id.toString());
        
    })

    it('Test to Post TODO from user', async () => {
        await UserModel.create({email: 'test@example.com', password: await bcrypt.hash('test', 8)})

        const userFound = await UserModel.findOne({ email: 'test@example.com' });

        if (!userFound) {
            throw new Error('User not found');
        }

        const token = jwt.sign({}, require('../../env/keys/index.js'), {
            subject: userFound._id.toString(),
            expiresIn: 60 * 60 * 24 * 30 * 6,
            algorithm: 'RS256',
        })

        const response = request(app).post('/add').send({text: 'test', completed: false}).set('Cookie', `token=${token}`);

        expect((await response).status).toBe(200);

    })

    it('Test to delete TODO from user', async () => {
        await UserModel.create({email: 'test@example.com', password: await bcrypt.hash('test', 8)})

        const userFound = await UserModel.findOne({ email: 'test@example.com' });

        if (!userFound) {
            throw new Error('User not found');
        }
        const todo = await TodoModel.create({text: 'test', completed: false, user_id: userFound._id.toString()});

        
        const response = request(app).post(`/${todo._id.toString()}`);
        console.log((await response).body);

        expect((await response).status).toBe(200);
        expect((await response).body).toBeNull();
    })
})