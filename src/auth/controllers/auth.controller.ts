import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserService } from '../services/user.service';
import { LoginReqDto } from '../dto/login-req.dto';
import { LogoutReqDto } from '../dto/logout-req.dto';
import { User } from '../entities/user.entity';
import { LoginResDto } from '../dto/login-res.dto';
import { RefreshReqDto } from '../dto/refresh-req.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<Partial<User>> {
    return await this.userService.createUser(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginReqDto): Promise<LoginResDto> {
    return this.authService.login(loginUserDto);
  }

  @Post('logout')
  logout(@Body() logoutReqDto: LogoutReqDto): void {
    this.authService.logout(logoutReqDto);
  }

  @Post('refresh')
  async refresh(@Body() refreshReqDto: RefreshReqDto): Promise<string> {
    return await this.authService.refresh(refreshReqDto);
  }
}
