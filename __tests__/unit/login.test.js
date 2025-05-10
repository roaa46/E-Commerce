const { login } = require('../../controllers/auth.controller');
const Users = require('../../models/user');
const bcrypt = require('bcrypt');
const httpMocks = require('node-mocks-http');

jest.mock('../../models/user');
jest.mock('bcrypt');

describe('login', () => {
    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        req.session = {}; // Mock session
        req.body = {
            email: 'john@example.com',
            password: 'password123',
        };
    });

    it('should return 400 if user does not exist', async () => {
        Users.findOne.mockResolvedValueOnce(null);
        await login(req, res);
        expect(res.statusCode).toBe(400);
        expect(JSON.parse(res._getData()).message).toBe('Invalid email or password');
    });

    it('should return 400 if password is incorrect', async () => {
        Users.findOne.mockResolvedValueOnce({ password: 'hashedPassword' });
        bcrypt.compare.mockResolvedValueOnce(false);
        await login(req, res);
        expect(res.statusCode).toBe(400);
        expect(JSON.parse(res._getData()).message).toBe('Invalid email or password');
    });
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    req.session = {}; // Mock session
    req.body = {
        email: 'john@example.com',
        password: 'password123',
    };
});

});