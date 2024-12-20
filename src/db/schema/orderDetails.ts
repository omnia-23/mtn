import { integer, pgTable, serial } from 'drizzle-orm/pg-core';
import { orderTable } from './order';
import { productTable } from './product';

export const orderDetailsTable = pgTable('order_details', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id').references(() => orderTable.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  product_id: integer('product_id').references(() => productTable.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  quantity: integer('quantity').notNull(),
});
