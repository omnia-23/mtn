"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const createTimestampFields_1 = require("../helpers/createTimestampFields");
exports.roleTable = (0, pg_core_1.pgTable)('role', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name').notNull().unique(),
    ...(0, createTimestampFields_1.createTimestampFields)(),
}, table => {
    return {
        nameIdx: (0, pg_core_1.uniqueIndex)('nameIdx').on(table.name),
    };
});
