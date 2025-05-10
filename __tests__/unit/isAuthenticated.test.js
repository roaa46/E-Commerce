// __tests__/middlewares/isAuthenticated.test.js
const isAuthenticated = require("../../middlewares/auth/isAuthenticated");

describe("isAuthenticated Middleware", () => {
  it("should call next() if user is logged in", () => {
    const req = {
      session: { user: { name: "test" } },
      accepts: jest.fn()
    };
    const res = {};
    const next = jest.fn();

    isAuthenticated(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("should redirect to login if not logged in and request expects HTML", () => {
    const req = {
      session: {},
      accepts: jest.fn(() => true)
    };
    const res = {
      redirect: jest.fn()
    };
    const next = jest.fn();

    isAuthenticated(req, res, next);

    expect(req.accepts).toHaveBeenCalledWith("html");
    expect(res.redirect).toHaveBeenCalledWith("/auth/login");
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 JSON if not logged in and request expects JSON", () => {
    const req = {
      session: {},
      accepts: jest.fn(() => false)
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    isAuthenticated(req, res, next);

    expect(req.accepts).toHaveBeenCalledWith("html");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    expect(next).not.toHaveBeenCalled();
  });
});
