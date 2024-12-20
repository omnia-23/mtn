import bcrypt from 'bcrypt';
import User from '../user/user.dal';
import Role from '../role/role.dal';
import { IAuthInputDTO } from './dto/auth-input';
import HttpError from '../../utils/HttpError';
import { IUserLoginDTO } from './dto/auth-login.dto';
import { generateAccessToken } from './auth.utils';

class UserService {
  constructor() {}

  async register(user: IAuthInputDTO) {
    const { email, password, username, roles } = user;

    const existingUser = await User.findByEmail(email);
    console.log({ existingUser });
    if (existingUser) {
      throw new HttpError(409, 'Email is already in use');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
    });

    const existRoles = await Role.checkRoleExist(roles);
    if (existRoles.length !== roles.length) {
      throw new HttpError(400, 'One or more roles do not exist');
    }

    for (const roleId of roles) {
      await Role.createUserRole({
        user_id: newUser.id,
        role_id: roleId,
      });
    }
    return newUser;
  }

  async login(user: IUserLoginDTO) {
    const { email, password } = user;
    const existUser = await User.findByEmail(email);

    if (!existUser) throw new HttpError(401, 'Invalid email or password');

    const isPasswordValid = await bcrypt.compare(password, existUser.password);
    if (!isPasswordValid) {
      throw new HttpError(401, 'Invalid email or password');
    }
    const userWithRoles = await Role.findUserRoles(existUser.id);
    const roles = userWithRoles.map(el => el.role);
    console.log({ roles });
    const token = generateAccessToken({ roles, userId: existUser.id });

    return { token };
  }
}

export default new UserService();
