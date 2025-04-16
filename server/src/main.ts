import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  // Create app instance, logger will be injected via WinstonModule
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Increase payload size limits
  app.use(bodyParser.json({ limit: '25mb' }));
  app.use(bodyParser.urlencoded({ limit: '25mb', extended: true }));

  // Enable CORS for frontend integration
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN', 'http://localhost:3000'),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  // Set global prefix for all routes
  app.setGlobalPrefix('api');

  // Enable validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Apply global filters and interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Configure Swagger documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('JIRA Voice Bot API')
    .setDescription('API documentation for the JIRA Voice Bot application')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('jira', 'JIRA integration endpoints')
    .addTag('voice', 'Voice processing endpoints')
    .addTag('system', 'System management endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = configService.get<number>('PORT', 3001);
  await app.listen(port);

  // Get the logger instance from the app context for bootstrap messages
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(
    `Swagger documentation is available at: http://localhost:${port}/api/docs`,
  );
}

// Using void operator to explicitly ignore the promise
void bootstrap();
