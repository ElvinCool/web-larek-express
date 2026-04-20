export const {
  DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek',
  PORT = '3000',
  AUTH_ACCESS_TOKEN_SECRET = 'access-secret',
  AUTH_REFRESH_TOKEN_SECRET = 'refresh-secret',
} = process.env;

export const AUTH_ACCESS_TOKEN_EXPIRY: string = process.env.AUTH_ACCESS_TOKEN_EXPIRY || '10m';
export const AUTH_REFRESH_TOKEN_EXPIRY: string = process.env.AUTH_REFRESH_TOKEN_EXPIRY || '7d';
