import { timestamp } from 'drizzle-orm/pg-core';

export function createTimestampFields() {
  return {
    createdAt: timestamp('createdAt', { precision: 6, withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updatedAt', { precision: 6, withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
  };
}
