const app = require("./src/app");
const sequelize = require("./src/config/database");

const PORT = process.env.PORT || 3000;

let server;

require("./src/models");

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connected");


        // 🔥 THIS LINE CREATES TABLES
        await sequelize.sync();

        console.log("✅ Tables synced");
        server = app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });



    } catch (err) {
        console.error("❌ DB connection failed:", err.message);
        process.exit(1);
    }
};

startServer();


/**
 * Handle Synchronous Errors
 */
process.on("uncaughtException", (err) => {
    console.error("❌ Uncaught Exception:", err);

    if (server) {
        server.close(() => {
            console.log("Server closed.");
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});

/**
 * Handle Promise Rejections
 */
process.on("unhandledRejection", (reason) => {
    console.error("❌ Unhandled Rejection:", reason);

    if (server) {
        server.close(() => {
            console.log("Server closed.");
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});
