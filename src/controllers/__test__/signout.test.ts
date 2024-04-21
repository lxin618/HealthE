import request from 'supertest';
import app from '../../app';

var constFormData = {
    firstName: 'John',
    lastName: 'Doe',
    phone: '22123221',
    birthday: '01/01/2000',
}

// -- SIGN OUT -- //
it('should return 200 status on successful signout', async () => {
    constFormData['email'] = 'test@test.com'
    constFormData['password'] = 'Password'
    await request(app).post('/api/auth/register').send(constFormData).expect(200);
    const res = await request(app).post('/api/auth/login').send({
        type: 'email',
        value: 'test@test.com',
        password: 'Password'
    }).expect(200);
    expect((res).body.refreshToken).toBeDefined();
    const refreshToken = (res).body.refreshToken
    await request(app).post('/api/auth/logout').send({
        refreshToken: refreshToken
    }).expect(200);
});