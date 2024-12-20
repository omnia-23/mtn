import { eq, inArray } from 'drizzle-orm';
import db from '../../db/database';
import { roleTable, userRoleTable } from '../../db/models';

class RoleRepo {
  async findAll(skip: number, limit: number) {
    const roles = db.select().from(roleTable).offset(skip).limit(limit);
    return await roles;
  }

  async findById(id: number) {
    const roles = await db.select().from(roleTable).where(eq(roleTable.id, id));
    return roles[0];
  }

  async findUserRoles(userId: number) {
    const userRoles = await db
      .select({
        role: roleTable.name,
      })
      .from(userRoleTable)
      .where(eq(userRoleTable.user_id, userId))
      .innerJoin(roleTable, eq(roleTable.id, userRoleTable.role_id));
    return userRoles;
  }

  async checkRoleExist(ids: number[]) {
    const roles = await db.select().from(roleTable).where(inArray(roleTable.id, ids));
    return roles;
  }

  async create(data: { name: string }) {
    const newRole = await db.insert(roleTable).values(data).returning();
    return newRole[0];
  }

  async createUserRole(data: { user_id: number; role_id: number }) {
    const newRole = await db.insert(userRoleTable).values(data).returning();
    return newRole[0];
  }

  async updateUserRoles(userId: number, rolesIds: number[]) {
    await db.transaction(async trx => {
      const existingRoles = await trx.select().from(roleTable).where(inArray(roleTable.id, rolesIds));
      if (existingRoles.length !== rolesIds.length) {
        throw new Error('One or more roles do not exist');
      }

      await trx.delete(userRoleTable).where(eq(userRoleTable.user_id, userId));

      const userRoleData = rolesIds.map(roleId => ({
        user_id: userId,
        role_id: roleId,
      }));

      await trx.insert(userRoleTable).values(userRoleData);
      return existingRoles;
    });
  }

  async deleteUserRoles(userId: number) {
    const roles = await db.delete(userRoleTable).where(eq(userRoleTable.user_id, userId));
    return roles;
  }

  async update(id: number, data: { name: string }) {
    const updateRole = await db.update(roleTable).set(data).where(eq(roleTable.id, id)).returning();
    return updateRole[0];
  }

  async delete(id: number) {
    const deleteRole = await db.delete(roleTable).where(eq(roleTable.id, id)).returning();
    return deleteRole[0];
  }

  async deleteAll() {
    await db.delete(roleTable);
  }
}

export default new RoleRepo();
