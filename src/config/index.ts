import { loadConfig } from 'dotenv-handler';
import path from 'path';

export const envPath = path.resolve(__dirname, `../../.env`);

export default (): void => {
  loadConfig(envPath, {
    required: [
      'POSTGRES_USER',
      'POSTGRES_PORT',
      'POSTGRES_DB',
      'POSTGRES_USER',
      'POSTGRES_PASSWORD',
      'NODE_ENV',
      'PORT',
      'BASE_URL',
      'SECRET_KEY',
    ],
    expand: true,
  });
};
