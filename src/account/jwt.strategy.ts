import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'KTX_ACCESS_KEY',
    });
  }

  async validate(payload: any) {
    return {
      Username: payload.Username,
      Password: payload.Password,
      ChucVu: payload.ChucVu,
    };
  }
}
