import { eq, sql } from 'drizzle-orm';
import db from '../../db/database';
import { IUserDTO } from './dto/user.dto';
import { IUserInputDTO } from './dto/user-input';
import { roleTable, userRoleTable, userTable } from '../../db/models';

class UserRepository {
  async findAll(limit = 10, skip = 0) {
    const users = await db
      .select({
        id: userTable.id,
        username: userTable.username,
        email: userTable.email,
        roles: sql`
            COALESCE(
              json_agg(
                CASE 
                  WHEN ${roleTable.id} IS NOT NULL THEN json_build_object(
                    'id', ${roleTable.id},
                    'name', ${roleTable.name}
                  )
                END
              ) FILTER (WHERE ${roleTable.id} IS NOT NULL), '[]'
            )
          `.as('roles'),
      })
      .from(userTable)
      .leftJoin(userRoleTable, eq(userRoleTable.user_id, userTable.id))
      .leftJoin(roleTable, eq(userRoleTable.role_id, roleTable.id))
      .groupBy(userTable.id)
      .offset(Number(skip))
      .limit(Number(limit));
    return users;
  }

  async findByEmail(email: string) {
    const users = await db.select().from(userTable).where(eq(userTable.email, email));
    return users[0];
  }

  async findById(id: number) {
    const users = await db.select().from(userTable).where(eq(userTable.id, id));
    return users[0];
  }

  async findWithRole(id: number) {
    const user = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, id))
      .leftJoin(userRoleTable, eq(userRoleTable.user_id, userTable.id))
      .leftJoin(roleTable, eq(userRoleTable.role_id, roleTable.id));
    return user;
  }
  async create(data: IUserInputDTO) {
    const newUser = await db.insert(userTable).values(data).returning();
    return newUser[0];
  }

  async update(id: number, data: Partial<IUserDTO>) {
    const updatedUser = await db.update(userTable).set(data).where(eq(userTable.id, id)).returning();
    return updatedUser[0];
  }

  async delete(id: number) {
    const deletedUser = await db.delete(userTable).where(eq(userTable.id, id)).returning();
    return deletedUser[0];
  }
  async deleteAll() {
    await db.delete(userTable);
  }
}

export default new UserRepository();
