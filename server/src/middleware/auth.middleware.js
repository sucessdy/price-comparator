const { UnauthorizedError } = require("../errors/AppError");
const TokenUtils = require("../utils/tokenUtils");
const userRepository = require("../repositories/userRepository");
const authMiddleware = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;

    if (!authToken) throw new UnauthorizedError("Authentication required");
    if (!authToken.startsWith("Bearer ")) throw new UnauthorizedError("Access denied. Invalid token format");

    const token = authToken.split(" ")[1];
    const decodedToken = TokenUtils.verifyToken(token);
    const user = await userRepository.findById(decodedToken.id);

    if (!user) throw new UnauthorizedError("User not found");

    req.user = { id: user._id, role: user.role };
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return next(new UnauthorizedError("Invalid or expired access token"));
    }
    next(err); // pass to errorMiddleware, don't throw
  }
};
module.exports = authMiddleware;
