"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const createTimestampFields_1 = require("../helpers/createTimestampFields");
exports.productTable = (0, pg_core_1.pgTable)('product', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name').notNull(),
    price: (0, pg_core_1.decimal)('price', { precision: 10, scale: 2 }).notNull(),
    stock: (0, pg_core_1.integer)('stock').default(0),
    ...(0, createTimestampFields_1.createTimestampFields)(),
});
