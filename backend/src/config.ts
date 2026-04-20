import dotenv from 'dotenv';

dotenv.config();

export const DB_ADDRESS =
  process.env.DB_ADDRESS || 'mongodb://127.0.0.1:27017/weblarek';

export const PORT = Number(process.env.PORT) || 3000;

export const AUTH_ACCESS_TOKEN_SECRET =
  process.env.AUTH_ACCESS_TOKEN_SECRET || 'access-secret';

export const AUTH_REFRESH_TOKEN_SECRET =
  process.env.AUTH_REFRESH_TOKEN_SECRET || 'refresh-secret';

export const AUTH_ACCESS_TOKEN_EXPIRY =
  process.env.AUTH_ACCESS_TOKEN_EXPIRY || '10m';

export const AUTH_REFRESH_TOKEN_EXPIRY =
  process.env.AUTH_REFRESH_TOKEN_EXPIRY || '7d';
