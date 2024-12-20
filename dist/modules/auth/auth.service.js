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
class UserService {
    constructor() { }
    async register(user) {
        const { email, password, username, roles } = user;
        const existingUser = await user_dal_1.default.findByEmail(email);
        console.log({ existingUser });
        if (existingUser) {
            throw new HttpError_1.default(409, 'Email is already in use');
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = await user_dal_1.default.create({
            email,
            password: hashedPassword,
            username,
        });
        const existRoles = await role_dal_1.default.checkRoleExist(roles);
        if (existRoles.length !== roles.length) {
            throw new HttpError_1.default(400, 'One or more roles do not exist');
        }
        for (const roleId of roles) {
            await role_dal_1.default.createUserRole({
                user_id: newUser.id,
                role_id: roleId,
            });
        }
        return newUser;
    }
    async login(user) {
        const { email, password } = user;
        const existUser = await user_dal_1.default.findByEmail(email);
        if (!existUser)
            throw new HttpError_1.default(401, 'Invalid email or password');
        const isPasswordValid = await bcrypt_1.default.compare(password, existUser.password);
        if (!isPasswordValid) {
            throw new HttpError_1.default(401, 'Invalid email or password');
        }
        const userWithRoles = await role_dal_1.default.findUserRoles(existUser.id);
        const roles = userWithRoles.map(el => el.role);
        console.log({ roles });
        const token = (0, auth_utils_1.generateAccessToken)({ roles, userId: existUser.id });
        return { token };
    }
}
exports.default = new UserService();
