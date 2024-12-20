import bcrypt from 'bcrypt';
import db from './database';
import { roleTable, userRoleTable, userTable } from './models';

const seedDatabase = async () => {
  try {
    const hashedPassword = await bcrypt.hash('password', 10);
    const [adminRole, customerRole] = await db
      .insert(roleTable)
      .values([{ name: 'admin' }, { name: 'customer' }])
      .returning();

    const [adminUser, customerUser] = await db
      .insert(userTable)
      .values([
        {
          username: 'admin',
          email: 'admin@gmail.com',
          password: hashedPassword,
        },
        {
          username: 'customer',
          email: 'customer@gmail.com',
          password: hashedPassword,
        },
      ])
      .returning();

    if (adminRole && adminUser) {
      await db.insert(userRoleTable).values({
        user_id: adminUser.id,
        role_id: adminRole.id,
      });
    }
    if (customerRole && customerUser) {
      await db.insert(userRoleTable).values({
        user_id: customerUser.id,
        role_id: customerRole.id,
      });
    }

    console.log('Seeding complete: Admin user with admin role added.');
  } catch (error) {
    console.error('Error during seeding:', error);
  }
};

seedDatabase();
