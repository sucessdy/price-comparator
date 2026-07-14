const authServices = require("../services/authService");
const sendResponse = require("../utils/sendResponse");
const clearRefreshTokenCookie = require("../utils/Cookie")
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/auth",
};

function setRefreshTokenCookie(res, token) {
  res.cookie("refreshToken", token, cookieOptions);
}

class AuthControllers {
  static async register(req, res) {
    const result = await authServices.register(req.body);

    setRefreshTokenCookie(res, result.refreshToken);
    sendResponse(res, {
      statusCode: 201,
      message: "User registered successfully",

      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  }

  static async login(req, res) {
    const result = await authServices.login(req.body);

    setRefreshTokenCookie(res, result.refreshToken);
    sendResponse(res, {
      statusCode: 200,
      message: "Login successful",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  }

  static async refreshToken(req, res) {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    const result = await authServices.refreshAccessToken(refreshToken);

    setRefreshTokenCookie(res, result.refreshToken);

    sendResponse(res, {
      statusCode: 200,
      message: "Access token refreshed successfully",
      data: {
        accessToken: result.accessToken,
      },
    });
  }

  static async logout(req, res) {
    await authServices.logout(req.user.id);

    clearRefreshTokenCookie(res);
    sendResponse(res, {
      statusCode: 200,
      message: "Logged out successfully",
    });
  }

  static async getMe(req, res) {
    const user = await authServices.getCurrentUser(req.user.id);

    sendResponse(res, {
      statusCode: 200,
      message: "User fetched successfully",
      data: user,
    });
  }
}

module.exports = AuthControllers;
