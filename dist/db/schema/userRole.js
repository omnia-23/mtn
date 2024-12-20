"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoleTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const user_1 = require("./user");
const role_1 = require("./role");
const createTimestampFields_1 = require("../helpers/createTimestampFields");
exports.userRoleTable = (0, pg_core_1.pgTable)('user_role', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    user_id: (0, pg_core_1.integer)().references(() => user_1.userTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    }),
    role_id: (0, pg_core_1.integer)().references(() => role_1.roleTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    }),
    assigned_at: (0, pg_core_1.timestamp)('assigned_at').defaultNow(),
    ...(0, createTimestampFields_1.createTimestampFields)(),
}, table => {
    return {
        user_role_idx: (0, pg_core_1.uniqueIndex)('user_role_idx').on(table.user_id, table.role_id),
    };
});
