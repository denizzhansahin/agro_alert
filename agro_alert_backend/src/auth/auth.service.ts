import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import refreshJwtConfig from './config/refresh-jwt.config';
import { CurrentUser } from './types/current-user';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import * as bcrypt from 'bcrypt';
import { compare } from 'bcrypt';
import { KullaniciService } from 'src/kullanicilar/kullanicilar.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: KullaniciService,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY) private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>
  ) {}

  async validateUser(email: string, password: string) {
    console.log("email-şifre doğrulama");
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException("User not found");
    const isPasswordMatch = await compare(password, user.sifre);
    if (!isPasswordMatch) throw new UnauthorizedException('Invalid credentials');
    console.log("Kullanıcı validate user:", user);
    return { id: user.id, role: user.role, user }; // Rol bilgisini ekliyoruz
  }

  login(userId: number) {
    console.log("login token oluşturma");
    const payload: AuthJwtPayload = { sub: userId };
    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, this.refreshTokenConfig);
    console.log("Token oluşturuldu:", token);
    console.log("Refresh token oluşturuldu:", refreshToken);
    console.log("Kullanıcı id:", userId);
    return {
      id: userId,
      token,
      refreshToken
    };
  }

  refreshToken(userId: any) {
    console.log("login token yenileme");
    const payload: AuthJwtPayload = { sub: userId };
    const token = this.jwtService.sign(payload);
    return {
      id: userId,
      token,
    };
  }

  async validateJwtUser(userId: number): Promise<CurrentUser | null> {
    console.log("JWT kullanıcı doğrulama:", userId);
    const user = await this.userService.kullaniciBul(userId);
    if (!user) {
      console.log("Kullanıcı bulunamadı:", userId);
      return null; // Hata fırlatmak yerine null döner
    }
    const currentUser: CurrentUser = { id: user.id, role: user.role };
    console.log("Kullanıcı doğrulandı:", currentUser);
    console.log("Kullanıcı doğrulandı token:", currentUser);
    return currentUser;
  }

  verifyRefreshToken(token: string) {
    try {
      return this.jwtService.verify(token, { secret: this.refreshTokenConfig.secret });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  generateAccessToken(payload: AuthJwtPayload) {
    return this.jwtService.sign(payload);
  }
}