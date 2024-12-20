"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = __importDefault(require("../../db/database"));
const models_1 = require("../../db/models");
class UserRepository {
    async findAll(limit = 10, skip = 0) {
        const users = await database_1.default
            .select({
            id: models_1.userTable.id,
            username: models_1.userTable.username,
            email: models_1.userTable.email,
            roles: (0, drizzle_orm_1.sql) `
            COALESCE(
              json_agg(
                CASE 
                  WHEN ${models_1.roleTable.id} IS NOT NULL THEN json_build_object(
                    'id', ${models_1.roleTable.id},
                    'name', ${models_1.roleTable.name}
                  )
                END
              ) FILTER (WHERE ${models_1.roleTable.id} IS NOT NULL), '[]'
            )
          `.as('roles'),
        })
            .from(models_1.userTable)
            .leftJoin(models_1.userRoleTable, (0, drizzle_orm_1.eq)(models_1.userRoleTable.user_id, models_1.userTable.id))
            .leftJoin(models_1.roleTable, (0, drizzle_orm_1.eq)(models_1.userRoleTable.role_id, models_1.roleTable.id))
            .groupBy(models_1.userTable.id)
            .orderBy((0, drizzle_orm_1.desc)(models_1.userTable.createdAt))
            .offset(Number(skip))
            .limit(Number(limit));
        return users;
    }
    async findByEmail(email) {
        const users = await database_1.default.select().from(models_1.userTable).where((0, drizzle_orm_1.eq)(models_1.userTable.email, email));
        return users[0];
    }
    async findById(id) {
        const users = await database_1.default.select().from(models_1.userTable).where((0, drizzle_orm_1.eq)(models_1.userTable.id, id));
        return users[0];
    }
    async findWithRole(id) {
        const user = await database_1.default
            .select()
            .from(models_1.userTable)
            .where((0, drizzle_orm_1.eq)(models_1.userTable.id, id))
            .leftJoin(models_1.userRoleTable, (0, drizzle_orm_1.eq)(models_1.userRoleTable.user_id, models_1.userTable.id))
            .leftJoin(models_1.roleTable, (0, drizzle_orm_1.eq)(models_1.userRoleTable.role_id, models_1.roleTable.id));
        return user;
    }
    async create(data) {
        const newUser = await database_1.default.insert(models_1.userTable).values(data).returning();
        return newUser[0];
    }
    async update(id, data) {
        const updatedUser = await database_1.default.update(models_1.userTable).set(data).where((0, drizzle_orm_1.eq)(models_1.userTable.id, id)).returning();
        return updatedUser[0];
    }
    async delete(id) {
        const deletedUser = await database_1.default.delete(models_1.userTable).where((0, drizzle_orm_1.eq)(models_1.userTable.id, id)).returning();
        return deletedUser[0];
    }
    async deleteAll() {
        await database_1.default.delete(models_1.userTable);
    }
}
exports.default = new UserRepository();
