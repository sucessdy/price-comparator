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
  console.log("📝 Registering user:", email);
  
  //Check if user already exists
  const existingUser = await UserRepository.findByEmail(email);
  
  if (existingUser) {
    console.log("❌ User already exists:", email);
    throw new ConflictError("User with this email already exists");
  }
  
  console.log("✅ Creating user...");
  const user = await UserRepository.create({
    name,
    email,
    password,
  });
  
  console.log("✅ User created with ID:", user._id);
  
  const accessToken = TokenUtils.generateAccessToken(user._id);
  const refreshToken = TokenUtils.generateRefreshToken(user._id);
  
  console.log("🔑 Tokens generated");
  
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
    const user = await UserRepository.findByEmail(email, true);

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const accessToken = TokenUtils.generateAccessToken(user._id);
    const refreshToken = TokenUtils.generateRefreshToken(user._id);

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

    const user = await UserRepository.findByIdWithRefreshToken(decoded.id);

    if (!user || !user.refreshToken) {
      throw new AppError("Invalid user or token", 401);
    }

    // Using compareTokens 
    const isValidToken = await TokenUtils.compareTokens(
      refreshToken,
      user.refreshToken
    );

    if (!isValidToken) {
      throw new AppError("Invalid refresh token", 401);
    }

    const newAccessToken = TokenUtils.generateAccessToken(user._id);
    const newRefreshToken = TokenUtils.generateRefreshToken(user._id);

    user.refreshToken = await TokenUtils.hashToken(newRefreshToken);
    await user.save();

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  // Logout
  static async logout(userId) {
    const user = await UserRepository.findByIdWithRefreshToken(userId);

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
      role: user.role,
    };
  }
}

module.exports = AuthService;