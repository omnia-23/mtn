"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const createTimestampFields_1 = require("../helpers/createTimestampFields");
const user_1 = require("./user");
exports.orderTable = (0, pg_core_1.pgTable)('order', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    user_id: (0, pg_core_1.integer)('user_id').references(() => user_1.userTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    }),
    total_price: (0, pg_core_1.decimal)('total_price', { precision: 10, scale: 2 }).notNull(),
    orderDate: (0, pg_core_1.timestamp)('order_date').defaultNow(),
    ...(0, createTimestampFields_1.createTimestampFields)(),
});
