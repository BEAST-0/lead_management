import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      //? Extracting toekn from the auherization: bearer -token-
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      //? secret key used to verify token
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  //? Function will run after verifying the token and attach the user to the request
  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
