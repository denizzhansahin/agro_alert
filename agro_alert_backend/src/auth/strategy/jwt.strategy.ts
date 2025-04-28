import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import jwtConfig from "../config/jwt.config";
import { Inject, Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { AuthJwtPayload } from "../types/auth-jwtPayload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(jwtConfig.KEY) private jwtConfiguration: ConfigType<typeof jwtConfig>,
        private authService: AuthService
    ) {
        if (!jwtConfiguration.secret) {
            throw new Error('JWT secret is not defined');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtConfiguration.secret,
            ignoreExpiration: false,
        });
    }

    async validate(payload: AuthJwtPayload) {
        console.log("Gelen token bilgisine göre kullanıcı doğrulama");
        const userId = payload.sub;
        const user = await this.authService.validateJwtUser(userId);
        if (!user) {
            return null; // Kimlik doğrulama başarısızsa null döner
        }
        console.log("Kullanıcı bilgisi jwt strategy 1:", user);
        return user; // { id: number, role: Role } döner
    }
}