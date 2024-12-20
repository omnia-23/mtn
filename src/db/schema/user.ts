import { serial, varchar, uniqueIndex, pgTable } from 'drizzle-orm/pg-core';
import { createTimestampFields } from '../helpers/createTimestampFields';

export const userTable = pgTable(
  'user',
  {
    id: serial('id').primaryKey(),
    username: varchar('username').notNull(),
    email: varchar('email').notNull().unique(),
    password: varchar('password').notNull(),
    ...createTimestampFields(),
  },
  table => {
    return {
      emailIdx: uniqueIndex('email_idx').on(table.email),
    };
  },
);
