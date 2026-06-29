const authServices = require("../services/authService");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Should be false in development
  sameSite: "lax", // Fixed: was "sameStrict"
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/api/auth", // Fixed: added leading slash
};

class AuthControllers {
  static async register(req, res) {
    const result = await authServices.register(req.body);
    
    res.cookie("refreshToken", result.refreshToken, cookieOptions);
    
    res.status(201).json({
      success: true,
      user: result.user,
      accessToken: result.accessToken,
    });
  }

  static async login(req, res) {
    const result = await authServices.login(req.body);
    
    res.cookie("refreshToken", result.refreshToken, cookieOptions);
    
    res.status(200).json({
      success: true,
      user: result.user,
      accessToken: result.accessToken,
    });
  }

  static async refreshToken(req, res) {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    
    const result = await authServices.refreshAccessToken(refreshToken);
    
    res.cookie("refreshToken", result.refreshToken, cookieOptions);
    
    res.status(200).json({
      success: true,
      accessToken: result.accessToken,
    });
  }

  static async logout(req, res) {
    await authServices.logout(req.user.id);
    
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  }

  // Missing in your code
  static async getMe(req, res) {
    const user = await authServices.getCurrentUser(req.user.id);
    
    res.status(200).json({
      success: true,
      user,
    });
  }
}

module.exports = AuthControllers;