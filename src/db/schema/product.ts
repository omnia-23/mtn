import { decimal, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { createTimestampFields } from '../helpers/createTimestampFields';

export const productTable = pgTable('product', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').default(0),
  ...createTimestampFields(),
});
