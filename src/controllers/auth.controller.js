const authService = require("../services/auth.service");

const register = async (req, res) => {
  const user = await authService.register(req.body);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
};

const login = async (req, res) => {
    const data = await authService.login(req.body);

    return res.status(200).json({
        success: true,
        message: "Login successful",
        data,
    });
};

module.exports = {
  register,login
};
