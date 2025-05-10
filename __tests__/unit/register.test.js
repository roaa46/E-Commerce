jest.mock('../../models/user');
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

const { register } = require('../../controllers/auth.controller');
const Users = require('../../models/user');
const bcrypt = require('bcryptjs');

describe('register', () => {
  it('should register a new user successfully', async () => {
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
    const res = {
      redirect: jest.fn(),
    };

    bcrypt.hash.mockResolvedValue('hashedPassword123');
    Users.create.mockResolvedValue({
      firstName: 'John',
      lastName: 'Doe',
      mobile: '123456789',
      gender: 'Male',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'hashedPassword123',
      isAdmin: false,
      isTest: false,
    });

    await register(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(Users.create).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      mobile: '123456789',
      gender: 'Male',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'hashedPassword123',
      isAdmin: false,
      isTest: false,
    });
    expect(res.redirect).toHaveBeenCalledWith('/user');
  });
});
