const User = require("../models/userModel");
class UserRepository {
  //  Create a new user

  async create(userData) {
    return User.create(userData);
  }

  /**
   * Find user by email
   * Used during login
   */
  async findByEmail(email, includePassword = false) {
    const query = User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (includePassword) {
      query.select("+password");
    }

    return query;
  }
  //  find by id 
  async findById(id) {
    return User.findById(id);
  }
  //  Update user

  async updateById(id, data) {
    return User.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async findByIdWithRefreshToken(id) { 
    return User.findById(id).select("+refreshToken")
  }

  async deleteUser(id) {
    return User.findByIdAndDelete(id);
  }
}

module.exports = new UserRepository();
