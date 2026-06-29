require("dotenv").config();

const env = process.env.NODE_ENV || "development";

const baseConfig = {
    dialect: "mysql",
    host: process.env.DB_HOST,
    logging: env === "development" ? console.log : false,
};

const config = {
    development: {
        ...baseConfig,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
};

module.exports = config[env];