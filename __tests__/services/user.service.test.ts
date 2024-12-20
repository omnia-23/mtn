import UserService from '../../src/modules/user/user.service';
import User from '../../src/modules/user/user.dal';
import Role from '../../src/modules/role/role.dal';
import HttpError from '../../src/utils/HttpError';

jest.mock('../../src/modules/user/user.dal');
jest.mock('../../src/modules/role/role.dal');
jest.mock('bcrypt');

describe('User Service', () => {
  const mockUser = {
    id: 1,
    username: 'omnia',
    email: 'omnia@gmail.com',
    password: 'password',
    roles: [1],
  };

  const user = {
    username: 'omnia',
    email: 'omnia@gmail.com',
    password: 'password',
    roles: [1],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      (User.findByEmail as jest.Mock).mockResolvedValue(null);
      (Role.checkRoleExist as jest.Mock).mockResolvedValue([1]);
      (User.create as jest.Mock).mockResolvedValue(mockUser);
      (Role.createUserRole as jest.Mock).mockResolvedValue(null);
      const newUser = await UserService.createUser(user);
      expect(newUser).toEqual(mockUser);
    });

    it('should throw an error if email is already in use', async () => {
      (User.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      await expect(UserService.createUser(user)).rejects.toThrow(HttpError);
      expect(User.findByEmail).toHaveBeenCalledWith(user.email);
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (User.findByEmail as jest.Mock).mockResolvedValue(null);
      (Role.updateUserRoles as jest.Mock).mockResolvedValue([1]);
      (User.update as jest.Mock).mockResolvedValue({ ...mockUser, username: 'omniaa' });

      const updatedUser = await UserService.updateUser(1, { ...mockUser, username: 'omniaa' });

      expect(updatedUser?.username).toEqual('omniaa');
    });

    it('should throw error if user does not exist', async () => {
      const id = 999;
      const data = { email: 'updated@example.com' };

      (User.findById as jest.Mock).mockResolvedValue(null);

      await expect(UserService.updateUser(id, data)).rejects.toThrow(HttpError);
      expect(User.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      const id = 1;
      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (Role.deleteUserRoles as jest.Mock).mockResolvedValue([1]);
      (User.delete as jest.Mock).mockResolvedValue(null);

      await UserService.deleteUser(id);
    });

    it('should throw error if user does not exist', async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);
      await expect(UserService.deleteUser(10)).rejects.toThrow(HttpError);
    });
  });
});
