"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTimestampFields = createTimestampFields;
const pg_core_1 = require("drizzle-orm/pg-core");
function createTimestampFields() {
    return {
        createdAt: (0, pg_core_1.timestamp)('createdAt', { precision: 6, withTimezone: true }).defaultNow(),
        updatedAt: (0, pg_core_1.timestamp)('updatedAt', { precision: 6, withTimezone: true })
            .defaultNow()
            .$onUpdate(() => new Date()),
    };
}
