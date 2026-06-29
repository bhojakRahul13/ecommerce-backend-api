"use strict";

const bcrypt = require("bcrypt");

module.exports = {
    async up(queryInterface) {
        const password = await bcrypt.hash("Admin@123", 10);

        await queryInterface.bulkInsert("users", [
            {
                name: "Admin",
                email: "admin@gmail.com",
                password,
                role: "admin",
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete("users", {
            email: "admin@gmail.com",
        });
    },
};