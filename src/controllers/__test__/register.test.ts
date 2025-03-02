import request from 'supertest';
import app from '../../app';

var constFormData = {
    firstName: 'John',
    lastName: 'Doe',
    phone: '22123221',
    birthday: '01/01/2000',
}
// -- SIGN UP -- //
it('should return 200 status on successful register', async () => {
    const { accessToken, refreshToken } = await global.register();
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
});

it('should return 400 status on missing email or password', async () => {
    await request(app).post('/api/auth/register').send({
        password: 'Password',
        firstName: 'John',
        lastName: 'Doe',
        phone: '22123221',
        birthday: '01/01/2000',
    }).expect(400);
    return request(app).post('/api/auth/register').send({
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '22123221',
        birthday: '01/01/2000',
    }).expect(400);
})

it('should return 400 status on invalid email or invalid password', async () => {
    await request(app).post('/api/auth/register').send({
        email: 'test@test.com',
        password: 'pas',
        firstName: 'John',
        lastName: 'Doe',
        phone: '22123221',
        birthday: '01/01/2000',
    }).expect(400);

    return request(app).post('/api/auth/register').send({
        email: 'test',
        password: 'Password',
        firstName: 'John',
        lastName: 'Doe',
        phone: '22123221',
        birthday: '01/01/2000',
    }).expect(400);
})

it('disallows duplicate emails', async () => {
    constFormData['email'] = 'test@test.com'
    constFormData['password'] = 'Password'
    await request(app).post('/api/auth/register').send(constFormData).expect(200);
    return request(app).post('/api/auth/register').send(constFormData).expect(400);
})