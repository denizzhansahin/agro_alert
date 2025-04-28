import { registerAs } from '@nestjs/config';

export default registerAs('refresh-jwt', () => ({
  secret: process.env.REFRESH_JWT_SECRET,
  expiresIn: process.env.REFRESH_JWT_EXPIRE_IN
    ? parseInt(process.env.REFRESH_JWT_EXPIRE_IN, 10)
    : 604800, // 7 gün = 604800 saniye
}));