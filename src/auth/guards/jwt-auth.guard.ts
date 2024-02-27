import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BusinessException } from 'src/exception/BusinessException';

@Injectable()
export class JwtAccessGuard extends AuthGuard('access') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // 에러 발생 또는 토큰이 유효하지 않을 경우
    if (err || !user) {
      throw (
        err ||
        new BusinessException(
          'auth',
          info.message,
          this.apiMessage(info.name),
          HttpStatus.UNAUTHORIZED,
        )
      );
    }
    return user;
  }

  apiMessage(infoName: string) {
    if (infoName === 'JsonWebTokenError') return '토큰이 유효하지 않습니다.';
    if (infoName == 'TokenExpiredError') return '토큰이 만료되었습니다.';
    return infoName;
  }
}
