
import app from '../app';
import request from 'supertest';

declare global {
    namespace NodeJS {
        interface Global {
            register: () => Promise<string>;
        }
    }
}

global.register = async () => {
    const email = 'test@test.com'
    const password = 'Password'
    const firstName = 'John'
    const lastName = 'Doe'
    const phone = '22123221'
    const birthday = '01/01/2000'
    const res = await request(app).post('/api/auth/register').send({ 
        email, 
        password,
        firstName,
        lastName,
        phone,
        birthday
    }).expect(200);
    const { accessToken, refreshToken } = res.body
    return {
        accessToken,
        refreshToken
    }
}