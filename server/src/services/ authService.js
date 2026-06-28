const UserRepository = require("../repositories/userRepository");
const bcrypt = require("bcrypt");
const { NotFoundError, ConflictError, AppError, UnauthorizedError } = require("../errors/AppError");
const config = require("../config/config");
const jwt = require("jsonwebtoken");

exports.register = async ({ name, email, password }) => {
  // Check for existing user
  const existingUser = await UserRepository.findByEmail(email);

  if (existingUser) {
    throw new ConflictError("Email already registered");
  }

  // Hash password
  const hashPassword = await bcrypt.hash(password, 10);

  // Create new user
  const user = await UserRepository.create({
    name,
    email,
    password: hashPassword,
  });

  // Generate refresh token
  const refreshToken = jwt.sign(
    { id: user._id }, 
    config.JWT_SECRET, 
    { expiresIn: "7d" }
  );

  // Hash and store refresh token
  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  user.refreshToken = refreshTokenHash;
  await user.save();

  // Generate access token
  const accessToken = jwt.sign(
    { user: user._id },
    config.JWT_SECRET,
    { expiresIn: "15m" }
  );

  return {
    type: "created",
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    },
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

exports.login = async ({ email, password }) => {
  // Find user by email (pass string, not object)
  const user = await UserRepository.findByEmail(email);
  
  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  // COMPARE password - not hash!
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid email or password");
  }

  // Generate refresh token
  const refreshToken = jwt.sign(
    { id: user._id }, 
    config.JWT_SECRET, 
    { expiresIn: "7d" }
  );

  // Hash and store refresh token
  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  user.refreshToken = refreshTokenHash;
  await user.save();

  // Generate access token
  const accessToken = jwt.sign(
    { user: user._id },
    config.JWT_SECRET,
    { expiresIn: "15m" }
  );

  return {
    type: "login",
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    },
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

exports.refreshAccessToken = ({refreshToken}) => {
if(!refreshToken) { 
  throw 
}
}
