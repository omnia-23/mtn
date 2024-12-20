import { integer, pgTable, serial, timestamp, decimal } from 'drizzle-orm/pg-core';
import { createTimestampFields } from '../helpers/createTimestampFields';
import { userTable } from './user';

export const orderTable = pgTable('order', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => userTable.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  total_price: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  orderDate: timestamp('order_date').defaultNow(),
  ...createTimestampFields(),
});
