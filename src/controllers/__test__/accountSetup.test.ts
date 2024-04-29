import request from 'supertest';
import app from '../../app';

it('has a route handler listening to /api/customer/profile for patch requests', async () => {
    const response = await request(app).patch('/api/customer/profile').send({});
    expect(response.status).not.toEqual(404);
})

it('can only be accessed if the user is signed in', async () => {
    await request(app).patch('/api/customer/profile').send({}).expect(401);
})

it('returns a status other than 401 if the user is signed in', async () => {
    const token = await global.login();
    const response = await request(app)
        .patch('/api/customer/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({});
    expect(response.status).not.toEqual(401);
})