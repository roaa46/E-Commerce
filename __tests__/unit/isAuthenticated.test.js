const isAuthenticated = require('../../middlewares/isAuthenticated');

describe('isAuthenticated middleware', () => {
  const mockReq = {};
  const mockRes = {
    redirect: jest.fn(),
  };
  const mockNext = jest.fn();

  beforeEach(() => {
    // reset mocks before each test
    mockRes.redirect.mockReset();
    mockNext.mockReset();
  });

  test('should call next() if user is authenticated', () => {
    mockReq.session = { user: { name: 'Roaa' } };

    isAuthenticated(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.redirect).not.toHaveBeenCalled();
  });

  test('should redirect to login if user is not authenticated', () => {
    mockReq.session = {}; // no user

    isAuthenticated(mockReq, mockRes, mockNext);

    expect(mockRes.redirect).toHaveBeenCalledWith('/auth/login');
    expect(mockNext).not.toHaveBeenCalled();
  });
});
