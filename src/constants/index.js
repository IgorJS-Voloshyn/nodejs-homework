import path from 'node:path';

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};
export const ACCESS_TOKEN_TTL = 15 * 60 * 1000;
export const REFRESH_TOKEN_TTL = 24 * 30 * 60 * 60 * 1000;

export const SMTP = {
  HOST: process.env.SMTP_HOST,
  PORT: Number(process.env.SMTP_PORT),
  USER: process.env.SMTP_USER,
  PASSWORD: process.env.SMTP_PASSWORD,
  FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
};
export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const CLOUDINARY = {
  CLOUD_NAME: 'CLOUD_NAME',
  API_KEY: 'API_KEY',
  API_SECRET: 'API_SECRET',
};
export const TEMPLATE_DIR = path.resolve('src', 'templates');
