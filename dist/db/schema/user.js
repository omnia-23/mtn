"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const createTimestampFields_1 = require("../helpers/createTimestampFields");
exports.userTable = (0, pg_core_1.pgTable)('user', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    username: (0, pg_core_1.varchar)('username').notNull(),
    email: (0, pg_core_1.varchar)('email').notNull().unique(),
    password: (0, pg_core_1.varchar)('password').notNull(),
    ...(0, createTimestampFields_1.createTimestampFields)(),
}, table => {
    return {
        emailIdx: (0, pg_core_1.uniqueIndex)('email_idx').on(table.email),
    };
});
