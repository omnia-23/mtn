"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("./database"));
const models_1 = require("./models");
const seedDatabase = async () => {
    try {
        const hashedPassword = await bcrypt_1.default.hash('password', 10);
        const [adminRole, customerRole] = await database_1.default
            .insert(models_1.roleTable)
            .values([{ name: 'admin' }, { name: 'customer' }])
            .returning();
        const [adminUser, customerUser] = await database_1.default
            .insert(models_1.userTable)
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
            await database_1.default.insert(models_1.userRoleTable).values({
                user_id: adminUser.id,
                role_id: adminRole.id,
            });
        }
        if (customerRole && customerUser) {
            await database_1.default.insert(models_1.userRoleTable).values({
                user_id: customerUser.id,
                role_id: customerRole.id,
            });
        }
        console.log('Seeding complete: Admin user with admin role added.');
    }
    catch (error) {
        console.error('Error during seeding:', error);
    }
};
seedDatabase();
