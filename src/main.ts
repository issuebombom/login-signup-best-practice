import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BusinessExceptionFilter } from './exception/BesinessExceptionFilter';
import { ConfigService } from '@nestjs/config';
import { setSwagger } from './app.swagger';
import { getNestOptions } from './app.options';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, getNestOptions()); // 옵션 추가: 로깅, cors
  app.useGlobalFilters(new BusinessExceptionFilter());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  const env = configService.get<string>('ENV');
  const serviceName = configService.get<string>('SERVICE_NAME');

  console.log(`env: ${env}\tport: ${port}\tserviceName: ${serviceName}`);

  setSwagger(app);
  app.enableCors();
  await app.listen(port);
}
bootstrap();
