import { InjectRepository } from '@nestjs/typeorm';
import { AccessToken } from '../entities/access-token.entity';
import { Repository } from 'typeorm';
import { Body, HttpStatus, Injectable } from '@nestjs/common';
import { LoginReqDto } from '../dto/login-req.dto';
import { LoginResDto } from '../dto/login-res.dto';
import { User } from '../entities/user.entity';
import { BusinessException } from 'src/exception/BusinessException';
import * as argon2 from 'argon2';
import { ITokenPayload } from '../interfaces/token-payload.interface';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LogoutReqDto } from '../dto/logout-req.dto';
import { TokenBlacklist, TokenType } from '../entities/token-blacklist.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { RefreshReqDto } from '../dto/refresh-req.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AccessToken)
    private readonly accessTokenRepository: Repository<AccessToken>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(TokenBlacklist)
    private readonly tokenBlacklistRepository: Repository<TokenBlacklist>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginReqDto): Promise<LoginResDto> {
    const user = await this.validateUser(dto.email, dto.password);
    const payload: ITokenPayload = this.createTokenPayload(user.id);

    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessToken(user, payload),
      this.createRefreshToken(user, payload),
    ]);
    return { accessToken, refreshToken };
  }

  async logout(dto: LogoutReqDto): Promise<void> {
    let payloadAccess: ITokenPayload;
    let payloadRefresh: ITokenPayload;

    try {
      [payloadAccess, payloadRefresh] = await Promise.all([
        this.jwtService.verifyAsync(dto.accessToken, {
          secret: this.configService.get<string>('JWT_SECRET'),
        }),
        this.jwtService.verifyAsync(dto.refreshToken, {
          secret: this.configService.get<string>('JWT_SECRET'),
        }),
      ]);
    } catch (error) {
      throw new BusinessException(
        'auth',
        'invalid-token',
        'invalid-token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    Promise.all([
      this.addToBlacklist(
        payloadAccess.jti,
        'access',
        this.configService.get<string>('ACCESS_TOKEN_EXPIRY'),
      ),
      this.addToBlacklist(
        payloadRefresh.jti,
        'refresh',
        this.configService.get<string>('REFRESH_TOKEN_EXPIRY'),
      ),
    ]);
  }

  async refresh(dto: RefreshReqDto): Promise<string> {
    try {
      const payloadRefresh = await this.jwtService.verifyAsync(
        dto.refreshToken,
        {
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      );
      const user = await this.userRepository.findOneBy({
        id: payloadRefresh.sub,
      });
      if (!user) {
        throw new BusinessException(
          'user',
          'user-not-found',
          'user-not-found',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const payloadAccess = this.createTokenPayload(user.id);

      return await this.createAccessToken(user, payloadAccess);
    } catch (error) {
      throw new BusinessException(
        'auth',
        'invalid-refresh-token',
        'invalid-refresh-token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private async validateUser(email: string, plainPassword: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await argon2.verify(user.password, plainPassword))) {
      return user;
    }
    throw new BusinessException(
      'auth',
      'invalid-credentials',
      'invalid-credentials',
      HttpStatus.UNAUTHORIZED,
    );
  }

  private createTokenPayload(userId: string): ITokenPayload {
    return {
      sub: userId,
      iat: Date.now(),
      jti: uuidv4(),
    };
  }

  private async createAccessToken(
    user: User,
    payload: ITokenPayload,
  ): Promise<string> {
    const expiresIn = this.configService.get<string>('ACCESS_TOKEN_EXPIRY');
    const token = this.jwtService.sign(payload, { expiresIn });
    const expiresAt = this.calculateExpiry(expiresIn);
    await this.accessTokenRepository.save({
      user,
      jti: payload.jti,
      expiresAt,
    });

    return token;
  }

  private async createRefreshToken(
    user: User,
    payload: ITokenPayload,
  ): Promise<string> {
    const expiresIn = this.configService.get<string>('REFRESH_TOKEN_EXPIRY');
    const token = this.jwtService.sign(payload, { expiresIn });
    const expiresAt = this.calculateExpiry(expiresIn);

    await this.refreshTokenRepository.save({
      user,
      jti: payload.jti,
      expiresAt,
    });

    return token;
  }

  private addToBlacklist(
    jti: string,
    tokenType: TokenType,
    expiresIn: string,
  ): void {
    const expiresAt = this.calculateExpiry(expiresIn);
    this.tokenBlacklistRepository.save({
      jti,
      tokenType,
      expiresAt,
    });
  }

  private calculateExpiry(expiresIn: string): Date {
    let expiresInMilliseconds = 0;

    if (expiresIn.endsWith('d')) {
      const days = parseInt(expiresIn.slice(0, -1), 10);
      expiresInMilliseconds = days * 24 * 60 * 60 * 1000;
    } else if (expiresIn.endsWith('h')) {
      const hours = parseInt(expiresIn.slice(0, -1), 10);
      expiresInMilliseconds = hours * 60 * 60 * 1000;
    } else if (expiresIn.endsWith('m')) {
      const minutes = parseInt(expiresIn.slice(0, -1), 10);
      expiresInMilliseconds = minutes * 60 * 1000;
    } else if (expiresIn.endsWith('s')) {
      const seconds = parseInt(expiresIn.slice(0, -1), 10);
      expiresInMilliseconds = seconds * 1000;
    } else {
      throw new BusinessException(
        'auth',
        'invalid-expiry',
        'invalid-expiry',
        HttpStatus.BAD_REQUEST,
      );
    }
    return new Date(Date.now() + expiresInMilliseconds);
  }
}
