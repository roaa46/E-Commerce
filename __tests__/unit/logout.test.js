const { logout } = require('../../controllers/auth.controller');
const httpMocks = require('node-mocks-http');

describe('logout', () => {
  it('should destroy session and redirect', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    req.session = { destroy: jest.fn() };
    await logout(req, res);

    expect(req.session.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(302); // 302: Redirect
  });
});
