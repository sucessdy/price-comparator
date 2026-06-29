const UserRepository = require("../repositories/userRepository");

const {
  ConflictError,
  AppError,
  UnauthorizedError,
} = require("../errors/AppError");

const TokenUtils = require("../utils/tokenUtils");


class AuthService {
  // Register
  static async register({ name, email, password }) {
    // Check for existing user
    const existingUser = await UserRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictError("Email already registered");
    }

    // Hash password

    // Create new user
    const user = await UserRepository.create({
      name,
      email,
      password
    });

    // Generate tokens
    const accessToken = TokenUtils.generatedAccessToken(user._id);
    const refreshToken = TokenUtils.generatedRefreshToken(user._id);

    // Hash and store refresh token
    const refreshTokenHash = await TokenUtils.hashToken(refreshToken);
    user.refreshToken = refreshTokenHash;
    await user.save();

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }

  // Login
  static async login({ email, password }) {
    // Find user and include password
    const user = await UserRepository.findByEmail(email, true);

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Generate tokens
    const accessToken = TokenUtils.generatedAccessToken(user._id);
    const refreshToken = TokenUtils.generatedRefreshToken(user._id);

    // Hash and store refresh token
    const refreshTokenHash = await TokenUtils.hashToken(refreshToken);
    user.refreshToken = refreshTokenHash;
    await user.save();

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }

  // Refresh Access Token - FIXED
  static async refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      throw new AppError("Refresh token is required", 401);
    }

    let decoded;
    try {
      decoded = TokenUtils.verifyToken(refreshToken);
    } catch (error) {
      throw new AppError("Invalid or expired refresh token", 401);
    }

    // Find user by ID from token (not email)
    const user = await UserRepository.findByIdWithRefreshToken(decoded.id)

    if (!user || !user.refreshToken) {
      throw new AppError("Invalid user or token", 401);
    }

    // Compare tokens
    const isValidToken = await TokenUtils.compareToken(
      refreshToken,
      user.refreshToken
    );

    if (!isValidToken) {
      throw new AppError("Invalid refresh token", 401);
    }

    // Generate new token pair
    const newAccessToken = TokenUtils.generatedAccessToken(user._id);
    const newRefreshToken = TokenUtils.generatedRefreshToken(user._id);

    // Update refresh token in DB
    user.refreshToken = await TokenUtils.hashToken(newRefreshToken);
    await user.save();

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  // Logout
  static async logout(userId) {
    const user = await UserRepository.findById(userId);

    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    return { message: "Logged out successfully" };
  }

  // Get current user
  static async getCurrentUser(userId) {
    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
    };
  }
}

module.exports = AuthService;