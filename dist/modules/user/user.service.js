"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpError_1 = __importDefault(require("../../utils/HttpError"));
const role_dal_1 = __importDefault(require("../role/role.dal"));
const user_dal_1 = __importDefault(require("./user.dal"));
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * Service class for handling user-related operations including
 * fetching, creating, updating, and deleting users.
 */
class UserService {
    /**
     * Retrieves a list of all users, with optional pagination.
     * This method fetches users from the database with the option to limit and skip items.
     *
     * @param {IFiltersDTO} filter - The filter parameters for pagination.
     * @param {number} filter.limit - The maximum number of users to fetch.
     * @param {number} filter.skip - The number of users to skip for pagination.
     * @returns {Promise<any>} - A list of users that match the filter criteria.
     */
    async getAllUser(filter) {
        const { limit, skip } = filter;
        console.log({ filter });
        const users = await user_dal_1.default.findAll(limit, skip);
        return users;
    }
    /**
     * Creates a new user in the database.
     * This method checks if the email already exists, hashes the password, and creates the user.
     * It also assigns roles to the user after verifying that they exist.
     *
     * @param {Object} data - The user data.
     * @param {string} data.username - The username of the new user.
     * @param {string} data.email - The email of the new user.
     * @param {string} data.password - The password of the new user.
     * @param {number[]} data.roles - The list of role IDs to assign to the user.
     * @returns {Promise<any>} - The created user object.
     * @throws {HttpError} - Throws a 409 error if the email is already in use or a 400 error if any role doesn't exist.
     */
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
    /**
     * Updates an existing user based on their ID.
     * This method allows updating the username, email, password, and roles.
     * If the email already exists, it throws a 409 error.
     *
     * @param {number} id - The ID of the user to update.
     * @param {Object} data - The updated user data.
     * @param {string} [data.username] - The new username.
     * @param {string} [data.email] - The new email.
     * @param {string} [data.password] - The new password.
     * @param {number[]} [data.roles] - The updated list of role IDs.
     * @returns {Promise<any>} - The updated user object.
     * @throws {HttpError} - Throws a 404 error if the user is not found or a 409 error if the email already exists.
     */
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
                throw new HttpError_1.default(409, 'Email already exists');
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
    /**
     * Deletes a user from the database.
     * This method deletes a user by their ID, and also removes any roles associated with the user.
     *
     * @param {number} id - The ID of the user to delete.
     * @returns {Promise<void>} - A promise indicating the user has been deleted.
     * @throws {HttpError} - Throws a 404 error if the user is not found.
     */
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
