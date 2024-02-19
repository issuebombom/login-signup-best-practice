import { Body, Controller, Inject, Logger, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserService } from '../services/user.service';
import { LoginReqDto } from '../dto/login-req.dto';
import { LogoutReqDto } from '../dto/logout-req.dto';
import { User } from '../entities/user.entity';
import { LoginResDto } from '../dto/login-res.dto';
import { RefreshReqDto } from '../dto/refresh-req.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth API')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({
    summary: '회원가입 API',
    description: '사용자를 생성하고 사용자 정보를 리턴합니다.',
  })
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<Partial<User>> {
    return await this.userService.createUser(createUserDto);
  }

  @ApiOperation({
    summary: '로그인 API',
    description:
      '사용자 로그인을 인가하고 엑세스 토큰과 리프레시 토큰을 리턴합니다.',
  })
  @Post('login')
  async login(@Body() loginUserDto: LoginReqDto): Promise<LoginResDto> {
    return this.authService.login(loginUserDto);
  }

  @ApiOperation({
    summary: '로그아웃 API',
    description:
      '사용자를 로그인하고 엑세스 토큰과 리프레시 토큰을 만료합니다.',
  })
  @Post('logout')
  logout(@Body() logoutReqDto: LogoutReqDto): void {
    this.authService.logout(logoutReqDto);
  }

  @ApiOperation({
    summary: '리프레시 API',
    description:
      '엑세스 토큰이 만료될 경우 리프레시 토큰을 검증하고 엑세스 토큰을 발급합니다..',
  })
  @Post('refresh')
  async refresh(@Body() refreshReqDto: RefreshReqDto): Promise<string> {
    return await this.authService.refresh(refreshReqDto);
  }
}
