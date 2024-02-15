import { NestApplicationOptions } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export function getNestOptions(): NestApplicationOptions {
  const configService = new ConfigService();
  const env = configService.get<string>('ENV');
  const serviceName = configService.get<string>('SERVICE_NAME');
  const colorize = env !== 'prod';

  return {
    
  }
}
