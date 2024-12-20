import HttpError from '../../utils/HttpError';
import Role from '../role/role.dal';
import User from './user.dal';
import { IFiltersDTO } from './dto/filters.dto';
import bcrypt from 'bcrypt';

class UserService {
  async getAllUser(filter: IFiltersDTO) {
    const { limit, skip } = filter;
    console.log({ filter });
    const users = await User.findAll(limit, skip);
    return users;
  }

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
      if (existEmail) throw new HttpError(409, 'email exist already');
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
