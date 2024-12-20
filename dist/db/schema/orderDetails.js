"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderDetailsTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const order_1 = require("./order");
const product_1 = require("./product");
exports.orderDetailsTable = (0, pg_core_1.pgTable)('order_details', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    order_id: (0, pg_core_1.integer)('order_id').references(() => order_1.orderTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    }),
    product_id: (0, pg_core_1.integer)('product_id').references(() => product_1.productTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    }),
    quantity: (0, pg_core_1.integer)('quantity').notNull(),
});
