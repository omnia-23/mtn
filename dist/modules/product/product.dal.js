"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = __importDefault(require("../../db/database"));
const models_1 = require("../../db/models");
class ProductRepository {
    async findAll(limit = 10, skip = 0) {
        const users = await database_1.default
            .select()
            .from(models_1.productTable)
            .groupBy(models_1.productTable.id)
            .offset(Number(skip))
            .limit(Number(limit));
        return users;
    }
    async findById(id) {
        const users = await database_1.default.select().from(models_1.productTable).where((0, drizzle_orm_1.eq)(models_1.productTable.id, id));
        return users[0];
    }
    async create(data) {
        const newUser = await database_1.default.insert(models_1.productTable).values(data).returning();
        return newUser[0];
    }
    async update(id, data) {
        const updatedUser = await database_1.default.update(models_1.productTable).set(data).where((0, drizzle_orm_1.eq)(models_1.productTable.id, id)).returning();
        return updatedUser[0];
    }
    async delete(id) {
        const deletedUser = await database_1.default.delete(models_1.productTable).where((0, drizzle_orm_1.eq)(models_1.productTable.id, id)).returning();
        return deletedUser[0];
    }
    async deleteAll() {
        await database_1.default.delete(models_1.productTable);
    }
}
exports.default = new ProductRepository();
