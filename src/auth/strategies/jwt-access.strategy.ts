import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ITokenPayload } from '../interfaces/token-payload.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtAccessStretegy extends PassportStrategy(Strategy, 'access') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: new ConfigService().get<string>('JWT_SECRET'),
    });
  }

  // 토큰 유효성이 검증되었을 경우 실행, 그렇지 않을 경우 해당 함수는 pass
  validate(payload: ITokenPayload & { exp: number }) {
    return { id: payload.sub };
  }
}
