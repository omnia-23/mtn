"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_dal_1 = __importDefault(require("../user/user.dal"));
const role_dal_1 = __importDefault(require("../role/role.dal"));
const HttpError_1 = __importDefault(require("../../utils/HttpError"));
const auth_utils_1 = require("./auth.utils");
/**
 * Service class for handling user authentication, registration, and login.
 * Provides methods for registering new users, logging in users, and assigning roles.
 */
class UserService {
    constructor() { }
    /**
     * Registers a new user in the system.
     * This method checks if the email is already in use, hashes the password,
     * creates the user, and assigns roles to the user.
     *
     * @param {IAuthInputDTO} user - The user details for registration.
     * @param {string} user.email - The email of the user.
     * @param {string} user.password - The password of the user (will be hashed).
     * @param {string} user.username - The username of the user.
     * @param {number[]} user.roles - The list of role IDs assigned to the user.
     * @returns {Promise<any>} - The newly created user object.
     * @throws {HttpError} - Throws a 409 error if the email is already in use.
     * @throws {HttpError} - Throws a 400 error if one or more roles do not exist.
     */
    async register(user) {
        const { email, password, username, roles } = user;
        // Check if the email already exists
        const existingUser = await user_dal_1.default.findByEmail(email);
        if (existingUser) {
            throw new HttpError_1.default(409, 'Email is already in use');
        }
        // Hash the password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Create the new user
        const newUser = await user_dal_1.default.create({
            email,
            password: hashedPassword,
            username,
        });
        // Check if all provided roles exist
        const existRoles = await role_dal_1.default.checkRoleExist(roles);
        if (existRoles.length !== roles.length) {
            throw new HttpError_1.default(400, 'One or more roles do not exist');
        }
        // Assign roles to the user
        for (const roleId of roles) {
            await role_dal_1.default.createUserRole({
                user_id: newUser.id,
                role_id: roleId,
            });
        }
        return newUser;
    }
    /**
     * Logs in a user by validating the email and password, then generating an access token.
     * This method checks if the user exists, verifies the password, retrieves the user roles,
     * and generates an access token for the authenticated user.
     *
     * @param {IUserLoginDTO} user - The user login credentials.
     * @param {string} user.email - The email of the user.
     * @param {string} user.password - The password of the user.
     * @returns {Promise<{ token: string }>} - An object containing the JWT token.
     * @throws {HttpError} - Throws a 401 error if the email or password is incorrect.
     */
    async login(user) {
        const { email, password } = user;
        // Check if the user exists
        const existUser = await user_dal_1.default.findByEmail(email);
        if (!existUser)
            throw new HttpError_1.default(401, 'Invalid email or password');
        // Verify the password
        const isPasswordValid = await bcrypt_1.default.compare(password, existUser.password);
        if (!isPasswordValid) {
            throw new HttpError_1.default(401, 'Invalid email or password');
        }
        // Retrieve roles associated with the user
        const userWithRoles = await role_dal_1.default.findUserRoles(existUser.id);
        const roles = userWithRoles.map(el => el.role);
        // Generate the access token
        const token = (0, auth_utils_1.generateAccessToken)({ roles, userId: existUser.id });
        return { token };
    }
}
// Export the service to be used in other parts of the application
exports.default = new UserService();
