// auth.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenExpiryMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new UnauthorizedException('Token bulunamadı');

    try {
      const decoded = jwt.decode(token) as { exp: number };
      if (decoded.exp < Date.now() / 1000) {
        throw new UnauthorizedException('Token süresi dolmuş');
      }
      next();
    } catch (error) {
      throw new UnauthorizedException('Geçersiz token');
    }
  }
}