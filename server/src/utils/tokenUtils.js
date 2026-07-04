const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config/config");

class TokenUtils {
  static generateAccessToken(userId) {
    return jwt.sign({ id: userId }, config.JWT_SECRET, {
      expiresIn: config.JWT_ACCESS_EXPIRE,
    });
  }

  static generateRefreshToken(userId) {
    return jwt.sign({ id: userId }, config.JWT_SECRET, {
      expiresIn: config.JWT_REFRESH_EXPIRE,
    });
  }

  static verifyToken(token) {
    return jwt.verify(token, config.JWT_SECRET);
  }

  static async hashToken(token) {
    return await bcrypt.hash(token, 10);
  }

  static async compareTokens(plainToken, hashedToken) {
    return await bcrypt.compare(plainToken, hashedToken);
  }
}

module.exports = TokenUtils;