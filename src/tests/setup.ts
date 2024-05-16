import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_KEY } from '../config';

let mongo: MongoMemoryServer;
beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
});

global.register = async () => {
    const email = 'test@test.com';
    const password = 'Password';
    const firstName = 'John';
    const lastName = 'Doe';
    const phone = '22123221';
    const birthday = '01/01/2000';
    const res = await request(app)
        .post('/api/auth/register')
        .send({
            email,
            password,
            firstName,
            lastName,
            phone,
            birthday,
        })
        .expect(200);
    const { accessToken, refreshToken } = res.body;
    return {
        accessToken,
        refreshToken,
    };
};

global.login = () => {
    const payload = {
        email: 'test@test.com',
        _id: new mongoose.Types.ObjectId().toHexString(),
    };
    return jwt.sign(payload, ACCESS_TOKEN_KEY!);
};
