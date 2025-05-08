const { register } = require('../../controllers/auth.controller');
const Users = require('../../models/user');
const bcrypt = require('bcrypt');
const httpMocks = require('node-mocks-http');

jest.mock('../../models/user');
jest.mock('bcrypt');

describe('register', () => {
    it('should register a new user successfully', async () => {
        // Mock request and response
        const req = {
            body: {
                firstName: 'John',
                lastName: 'Doe',
                mobile: '123456789',
                gender: 'Male',
                username: 'johndoe',
                email: 'john@example.com',
                password: 'password123',
                confirmPassword: 'password123',
            },
            session: {},
        };

        const res = httpMocks.createResponse();
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn();
        res.redirect = jest.fn(); // Mock redirect

        // Mock bcrypt and Users behavior
        bcrypt.hash.mockResolvedValue('hashedPassword123');
        Users.findOne.mockResolvedValue(null); // No existing user
        Users.create.mockResolvedValue({
            id: 1,
            ...req.body,
            password: 'hashedPassword123',
            isAdmin: false,
        });

        // Call the register function
        await register(req, res);

        // ✅ Assertions
        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        expect(Users.create).toHaveBeenCalledWith({
            firstName: 'John',
            lastName: 'Doe',
            mobile: '123456789',
            gender: 'Male',
            username: 'johndoe',
            email: 'john@example.com',
            password: 'hashedPassword123',
            confirmPassword: 'hashedPassword123',
            isAdmin: false,
            isTest: false,
        });
        expect(res.redirect).toHaveBeenCalledWith('/user');
    });

    it('should return 400 if fields are missing', async () => {
        const req = {
            body: {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
            },
            session: {},
        };

        const res = httpMocks.createResponse();
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn();

        await register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 'failure',
            message: 'Missing required fields',
        });
    });

    it('should return 400 if user already exists', async () => {
        Users.findOne.mockResolvedValue(true); // Mock user already exists

        const req = {
            body: {
                firstName: 'John',
                lastName: 'Doe',
                mobile: '123456789',
                gender: 'Male',
                username: 'johndoe',
                email: 'john@example.com',
                password: 'password123',
                confirmPassword: 'password123',
            },
            session: {},
        };

        const res = httpMocks.createResponse();
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn();

        await register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 'failure',
            message: 'User already exists',
        });
    });
});
