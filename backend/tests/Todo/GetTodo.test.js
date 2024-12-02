// const request = require("supertest");
// const totoRouter = require("../../routes/todo.api.js");
// const express = require("express");
// const app = express();
// app.use(express.json());
// app.use(totoRouter);

// describe("GET /todos", () => {
//   it("should return all Todo", async () => {
//     const result = await request(app)
//       .get("/")
//       .expect(200);
    
//     expect(result.body).toEqual([]);
//   });
// });

const request = require('supertest');
const express = require('express');
const routerAuth = require("../../routes/todo.api.js");


const app = express();
app.use(express.json());
app.use(routerAuth);

describe('test', () => {
    it('test', async() => {
        const response = await request(app)
            .get('/')
            .expect(200);
    })
})