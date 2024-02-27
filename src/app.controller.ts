import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { VerifiedUser } from './common/decorators/verified-user.decorator';
import { IVerifiedUser } from './common/interfaces/verified-user.interface';
import { JwtAccessGuard } from './auth/guards/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
