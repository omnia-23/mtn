import { serial, varchar, uniqueIndex, pgTable } from 'drizzle-orm/pg-core';
import { createTimestampFields } from '../helpers/createTimestampFields';

export const roleTable = pgTable(
  'role',
  {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull().unique(),
    ...createTimestampFields(),
  },
  table => {
    return {
      nameIdx: uniqueIndex('nameIdx').on(table.name),
    };
  },
);
