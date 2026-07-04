const { AppError, UnauthorizedError } = require("../errors/AppError");
const TokenUtils = require("../utils/tokenUtils");
const userRepository = require("../repositories/userRepository");
const authMiddleware =  async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      throw new UnauthorizedError("Invalid token");
    }

    const decodedToken = TokenUtils.verifyToken(token);
    if (!decodedToken) {
      throw new UnauthorizedError("Invalid decoded token");
    }

    const user = await userRepository.findById(decodedToken.id);

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    req.user = {
      id: user._id,
      role: user.role,
    };
    next();
  } catch (err) {
    throw new UnauthorizedError("Invalid or expired refresh token");
  }
};
module.exports = authMiddleware;
