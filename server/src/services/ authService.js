const UserRepository = require("../repositories/userRepository");
const bcrypt = require("bcrypt");
const { NotFoundError } = require("../errors/AppError");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
exports.Register = async ({ name, email, password }) => {
  const existingEmail = await UserRepository.findByEmail(email);

  if (existingEmail) {
    const updateEmail = await UserRepository.updateById(
      existingEmail.id,
      existingEmail.email,
    );
    return {
      type: "update",
      email: updateEmail,
    };
  }

  const hashPassword = await bcrypt.hash(password, 10);
  if (!hashPassword) {
   
  }

  const user = await UserRepository.create({
    name,
    email,
    hashPassword,
  });

  const refereshToken = await jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "7d",
  });
  const refereshTokenHash = await bcrypt.hash(refereshToken, 10) 

  return {
    type: "created",
    user: user,
  };
};
