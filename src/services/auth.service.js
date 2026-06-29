const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");


const register = async (data) => {
  const { name, email, password } = data;

  /** email already exists check  */
  const existingUser = await User.findOne({
    where: { email },
  });

  if (existingUser) {
    const error = new Error("Email already exists");
    error.statusCode = 409;
    throw error;
  }

  /** password hading */
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  /** NO return Password  */
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};


const login = async ({ email, password }) => {
    const user = await User.findOne({
        where: { email },
    });

    if (!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const token = generateToken({
        id: user.id,
        role: user.role,
    });

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};

module.exports = {
  register,
  login
};
