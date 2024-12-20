"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpError_1 = __importDefault(require("../../utils/HttpError"));
const role_dal_1 = __importDefault(require("../role/role.dal"));
const user_dal_1 = __importDefault(require("./user.dal"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    async getAllUser(filter) {
        const { limit, skip } = filter;
        console.log({ filter });
        const users = await user_dal_1.default.findAll(limit, skip);
        return users;
    }
    async createUser(data) {
        const { email, password, username, roles } = data;
        console.log({ data });
        const existingUser = await user_dal_1.default.findByEmail(email);
        console.log({ existingUser });
        if (existingUser) {
            throw new HttpError_1.default(409, 'Email is already in use');
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await user_dal_1.default.create({ email, password: hashedPassword, username });
        console.log({ user });
        const existRoles = await role_dal_1.default.checkRoleExist(roles);
        console.log({ existRoles });
        if (existRoles.length !== roles.length) {
            throw new HttpError_1.default(400, 'One or more roles do not exist');
        }
        for (const roleId of roles) {
            await role_dal_1.default.createUserRole({
                user_id: user.id,
                role_id: roleId,
            });
        }
        return user;
    }
    async updateUser(id, data) {
        const { email, password, username, roles } = data;
        console.log({ id, data });
        const existingUser = await user_dal_1.default.findById(id);
        console.log({ existingUser });
        if (!existingUser) {
            throw new HttpError_1.default(404, 'User not found');
        }
        if (email) {
            const existEmail = await user_dal_1.default.findByEmail(email);
            if (existEmail)
                throw new HttpError_1.default(409, 'email exist already');
        }
        const updatedUser = {
            email: email || existingUser.email,
            password: password ? await bcrypt_1.default.hash(password, 10) : existingUser.password,
            username: username || existingUser.username,
        };
        const user = await user_dal_1.default.update(id, updatedUser);
        if (!user) {
            throw new HttpError_1.default(500, 'Failed to update user');
        }
        let newRoles = null;
        if (roles) {
            newRoles = await role_dal_1.default.updateUserRoles(user.id, roles);
            return {
                ...user,
                roles: newRoles,
            };
        }
        return { ...user };
    }
    async deleteUser(id) {
        const existingUser = await user_dal_1.default.findById(id);
        console.log({ existingUser });
        if (!existingUser) {
            throw new HttpError_1.default(404, 'User not found');
        }
        await role_dal_1.default.deleteUserRoles(existingUser.id);
        await user_dal_1.default.delete(id);
    }
}
exports.default = new UserService();
