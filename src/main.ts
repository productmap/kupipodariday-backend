import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import 'dotenv/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors();
  const configService = app.get<ConfigService>(ConfigService);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  await app.listen(configService.get('app.port'));
}
bootstrap();
