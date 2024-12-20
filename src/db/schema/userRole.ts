import { integer, pgTable, serial, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { userTable } from './user';
import { roleTable } from './role';
import { createTimestampFields } from '../helpers/createTimestampFields';

export const userRoleTable = pgTable(
  'user_role',
  {
    id: serial('id').primaryKey(),
    user_id: integer().references(() => userTable.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    role_id: integer().references(() => roleTable.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    assigned_at: timestamp('assigned_at').defaultNow(),
    ...createTimestampFields(),
  },
  table => {
    return {
      user_role_idx: uniqueIndex('user_role_idx').on(table.user_id, table.role_id),
    };
  },
);
