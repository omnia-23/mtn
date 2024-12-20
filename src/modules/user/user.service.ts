import HttpError from '../../utils/HttpError';
import Role from '../role/role.dal';
import User from './user.dal';
import { IFiltersDTO } from './dto/filters.dto';
import bcrypt from 'bcrypt';

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
  async getAllUser(filter: IFiltersDTO) {
    const { limit, skip } = filter;
    console.log({ filter });
    const users = await User.findAll(limit, skip);
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
  async createUser(data: { username: string; email: string; password: string; roles: number[] }) {
    const { email, password, username, roles } = data;
    console.log({ data });
    const existingUser = await User.findByEmail(email);
    console.log({ existingUser });
    if (existingUser) {
      throw new HttpError(409, 'Email is already in use');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, username });
    console.log({ user });

    const existRoles = await Role.checkRoleExist(roles);
    console.log({ existRoles });
    if (existRoles.length !== roles.length) {
      throw new HttpError(400, 'One or more roles do not exist');
    }

    for (const roleId of roles) {
      await Role.createUserRole({
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
  async updateUser(id: number, data: { username?: string; email?: string; password?: string; roles?: number[] }) {
    const { email, password, username, roles } = data;
    console.log({ id, data });

    const existingUser = await User.findById(id);
    console.log({ existingUser });
    if (!existingUser) {
      throw new HttpError(404, 'User not found');
    }

    if (email) {
      const existEmail = await User.findByEmail(email);
      if (existEmail) throw new HttpError(409, 'Email already exists');
    }

    const updatedUser = {
      email: email || existingUser.email,
      password: password ? await bcrypt.hash(password, 10) : existingUser.password,
      username: username || existingUser.username,
    };
    const user = await User.update(id, updatedUser);
    if (!user) {
      throw new HttpError(500, 'Failed to update user');
    }

    let newRoles = null;
    if (roles) {
      newRoles = await Role.updateUserRoles(user.id, roles);
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
  async deleteUser(id: number) {
    const existingUser = await User.findById(id);
    console.log({ existingUser });
    if (!existingUser) {
      throw new HttpError(404, 'User not found');
    }
    await Role.deleteUserRoles(existingUser.id);
    await User.delete(id);
  }
}

export default new UserService();
