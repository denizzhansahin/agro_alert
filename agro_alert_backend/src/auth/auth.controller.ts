// auth.controller.ts
import { Body, Controller, HttpCode, HttpStatus, Post, UnauthorizedException, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.deacorator';
import { LocalAuthGuard } from './guards/local-auth.guard';


@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Request() req) {
    //kullanıcı id bilgisine göre token oluşturma
    const userData = this.authService.login(req.user.id)
    console.log("token alma")
    console.log("token alma 1")
    console.log(req.user.id)
    console.log(req.token)
    console.log(req.user)
    //return userİd;
    return {reqUser:req.user, userData:userData}
  }

  @Public()
  @Post('refresh')
  async refresh(@Body('refresh_token') refreshToken: string) {
    try {
      // Refresh token’ı doğruluyoruz
      const decoded = this.authService.verifyRefreshToken(refreshToken);
      // Burada decoded.sub (kullanıcı id) veya decoded.email ile kullanıcıyı DB’den sorgulayabilirsiniz.
      // Örneğin: const user = await this.usersService.findById(decoded.sub);
      // Kullanıcı doğrulandıktan sonra yeni bir access token üretiyoruz:
      const payload = { email: decoded.email, sub: decoded.sub };
      const newAccessToken = this.authService.generateAccessToken(payload);
      return { access_token: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Geçersiz refresh token');
    }
  }
}