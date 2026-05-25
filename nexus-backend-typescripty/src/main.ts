import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerFactory } from '@sharedModule/logger/util/logger.factory';

async function bootstrap() {
  const logger = LoggerFactory('application-main');
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useLogger(logger);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
