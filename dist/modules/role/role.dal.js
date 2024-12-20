"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = __importDefault(require("../../db/database"));
const models_1 = require("../../db/models");
class RoleRepo {
    async findAll(skip, limit) {
        const roles = database_1.default.select().from(models_1.roleTable).offset(skip).limit(limit);
        return await roles;
    }
    async findById(id) {
        const roles = await database_1.default.select().from(models_1.roleTable).where((0, drizzle_orm_1.eq)(models_1.roleTable.id, id));
        return roles[0];
    }
    async findUserRoles(userId) {
        const userRoles = await database_1.default
            .select({
            role: models_1.roleTable.name,
        })
            .from(models_1.userRoleTable)
            .where((0, drizzle_orm_1.eq)(models_1.userRoleTable.user_id, userId))
            .innerJoin(models_1.roleTable, (0, drizzle_orm_1.eq)(models_1.roleTable.id, models_1.userRoleTable.role_id));
        return userRoles;
    }
    async checkRoleExist(ids) {
        const roles = await database_1.default.select().from(models_1.roleTable).where((0, drizzle_orm_1.inArray)(models_1.roleTable.id, ids));
        return roles;
    }
    async create(data) {
        const newRole = await database_1.default.insert(models_1.roleTable).values(data).returning();
        return newRole[0];
    }
    async createUserRole(data) {
        const newRole = await database_1.default.insert(models_1.userRoleTable).values(data).returning();
        return newRole[0];
    }
    async updateUserRoles(userId, rolesIds) {
        await database_1.default.transaction(async (trx) => {
            const existingRoles = await trx.select().from(models_1.roleTable).where((0, drizzle_orm_1.inArray)(models_1.roleTable.id, rolesIds));
            if (existingRoles.length !== rolesIds.length) {
                throw new Error('One or more roles do not exist');
            }
            await trx.delete(models_1.userRoleTable).where((0, drizzle_orm_1.eq)(models_1.userRoleTable.user_id, userId));
            const userRoleData = rolesIds.map(roleId => ({
                user_id: userId,
                role_id: roleId,
            }));
            await trx.insert(models_1.userRoleTable).values(userRoleData);
            return existingRoles;
        });
    }
    async deleteUserRoles(userId) {
        const roles = await database_1.default.delete(models_1.userRoleTable).where((0, drizzle_orm_1.eq)(models_1.userRoleTable.user_id, userId));
        return roles;
    }
    async update(id, data) {
        const updateRole = await database_1.default.update(models_1.roleTable).set(data).where((0, drizzle_orm_1.eq)(models_1.roleTable.id, id)).returning();
        return updateRole[0];
    }
    async delete(id) {
        const deleteRole = await database_1.default.delete(models_1.roleTable).where((0, drizzle_orm_1.eq)(models_1.roleTable.id, id)).returning();
        return deleteRole[0];
    }
    async deleteAll() {
        await database_1.default.delete(models_1.roleTable);
    }
}
exports.default = new RoleRepo();
