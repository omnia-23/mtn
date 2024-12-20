import bcrypt from 'bcrypt';
import db from './database';
import { roleTable, userRoleTable, userTable } from './models';

const seedDatabase = async () => {
  try {
    const hashedPassword = await bcrypt.hash('password', 10);
    const [adminRole] = await db.insert(roleTable).values({ name: 'admin' }).returning();

    const [adminUser] = await db
      .insert(userTable)
      .values({
        username: 'admin',
        email: 'admin@gmail.com',
        phone: '1234567890',
        password: hashedPassword,
      })
      .returning();

    if (adminRole && adminUser) {
      await db.insert(userRoleTable).values({
        user_id: adminUser.id,
        role_id: adminRole.id,
      });
    }

    console.log('Seeding complete: Admin user with admin role added.');
  } catch (error) {
    console.error('Error during seeding:', error);
  }
};

seedDatabase();
