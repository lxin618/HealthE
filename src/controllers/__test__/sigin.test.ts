import request from 'supertest';
import app from '../../app';

var constFormData = {
    firstName: 'John',
    lastName: 'Doe',
    phone: '22123221',
    birthday: '01/01/2000',
}

// -- SIGN IN -- //
it('it fails when incorrect password is provided email', async () => {
    constFormData['email'] = 'test@test.com'
    constFormData['password'] = 'Password'
    await request(app).post('/api/auth/register').send(constFormData).expect(200);
    return request(app).post('/api/auth/login').send({
        type: 'email',
        value: 'test@test.com',
        password: 'Password1'
    }).expect(400);
})

it('should login successfully with correct phone number and password', async () => {
    constFormData['email'] = 'test123@test.com'
    constFormData['password'] = 'Password'
    await request(app).post('/api/auth/register').send(constFormData).expect(200);
    return request(app).post('/api/auth/login').send({
        type: 'phone',
        value: '22123221',
        password: 'Password'
    }).expect(200);
})

it('should login successfully with correct email and password', async () => {
    constFormData['email'] = 'test@test.com'
    constFormData['password'] = 'Password'
    await request(app).post('/api/auth/register').send(constFormData).expect(200);
    const res =  await request(app).post('/api/auth/login').send({
        type: 'email',
        value: 'test@test.com',
        password: 'Password'
    }).expect(200);
    // check if token is returned
    expect((res).body.accessToken).toBeDefined();
    expect((res).body.refreshToken).toBeDefined();
})