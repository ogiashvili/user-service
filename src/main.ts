import { NestFactory } from '@nestjs/core';
import { UserModule } from './user/user.module';
import {
  ExceptionHandler,
  ExceptionHandler1,
} from './exception-handler/exception-handler';
import {
  ValidationError,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ApiException } from './exception-handler/api-exception';
import { ConfigService } from '@nestjs/config';

function exceptionFactory(validationErrors: ValidationError[]) {
  const errors: ApiException[] = [];

  validationErrors.forEach((error) => {
    const err = new ApiException('WRONG_PARAM', error);
    errors.push(err);
  });
  throw errors;
}

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  app.useGlobalFilters(new ExceptionHandler(), new ExceptionHandler1());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory,
      forbidUnknownValues: false,
    }),
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>('API_PORT') || 8080;
  await app.listen(port);
}
bootstrap();
