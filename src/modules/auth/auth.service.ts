import bcrypt from 'bcrypt';
import User from '../user/user.dal';
import Role from '../role/role.dal';
import { IAuthInputDTO } from './dto/auth-input';
import HttpError from '../../utils/HttpError';
import { IUserLoginDTO } from './dto/auth-login.dto';
import { generateAccessToken } from './auth.utils';

/**
 * Service class for handling user authentication, registration, and login.
 * Provides methods for registering new users, logging in users, and assigning roles.
 */
class UserService {
  constructor() {}

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
  async register(user: IAuthInputDTO) {
    const { email, password, username, roles } = user;

    // Check if the email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new HttpError(409, 'Email is already in use');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
    });

    // Check if all provided roles exist
    const existRoles = await Role.checkRoleExist(roles);
    if (existRoles.length !== roles.length) {
      throw new HttpError(400, 'One or more roles do not exist');
    }

    // Assign roles to the user
    for (const roleId of roles) {
      await Role.createUserRole({
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
  async login(user: IUserLoginDTO) {
    const { email, password } = user;

    // Check if the user exists
    const existUser = await User.findByEmail(email);
    if (!existUser) throw new HttpError(401, 'Invalid email or password');

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, existUser.password);
    if (!isPasswordValid) {
      throw new HttpError(401, 'Invalid email or password');
    }

    // Retrieve roles associated with the user
    const userWithRoles = await Role.findUserRoles(existUser.id);
    const roles = userWithRoles.map(el => el.role);

    // Generate the access token
    const token = generateAccessToken({ roles, userId: existUser.id });

    return { token };
  }
}

// Export the service to be used in other parts of the application
export default new UserService();
