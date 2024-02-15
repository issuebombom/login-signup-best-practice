import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BusinessExceptionFilter } from './exception/BesinessExceptionFilter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // 옵션 추가: 로깅, cors
  app.useGlobalFilters(new BusinessExceptionFilter());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  const env = configService.get<string>('ENV');
  const serviceName = configService.get<string>('SERVICE_NAME');

  console.log(`env: ${env}\tport: ${port}\tserviceName: ${serviceName}`);

  await app.listen(port);
}
bootstrap();
