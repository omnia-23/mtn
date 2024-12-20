export interface IUserDTO {
  id: number;
  email: string;
  username: string;
  password: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}
