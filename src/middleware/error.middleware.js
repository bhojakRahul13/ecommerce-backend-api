module.exports = (err, req, res, next) => {

      console.log("ERROR MIDDLEWARE HIT",err.name);

    // Sequelize Validation Error
    if (err.name === "SequelizeValidationError") {
        return res.status(400).json({
            success: false,
            errors: err.errors.map((e) => ({
                field: e.path,
                message: e.message,
            })),
        });
    }

    // Sequelize Unique Constraint Error
    if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({
            success: false,
            message: err.errors[0].message || "Duplicate field value",
        });
    }

    // 🔹 Default Error
    console.error("❌ Error:", err.message);

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};