import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT,
  jwtPrivateKeyPath: process.env.JWT_PRIVATE_KEY_PATH,
};
