import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module'; // Adjust path as needed
import { INestApplication, ValidationPipe } from '@nestjs/common';
// Removed unused imports: ConfigModule, configuration, validationSchema

// Import other common modules/providers needed for most tests
// import { CustomLogger } from '../src/common/logger/custom-logger.service';

/**
 * Creates a standard NestJS testing application instance.
 * Configures global pipes, modules, etc. common to integration tests.
 */
export async function createTestApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      // Load configuration specifically for testing if needed, or use AppModule's
      AppModule,
      // Example: Override specific config for tests if necessary
      // ConfigModule.forRoot({
      //   isGlobal: true,
      //   load: [configuration],
      //   validationSchema,
      // }),
    ],
    // providers: [
    //   // Provide mocks here if needed globally for tests
    //   // CustomLogger, // Provide logger if needed directly
    // ],
  })
    // .overrideProvider(SomeServiceToMock).useValue(mockServiceObject)
    .compile();

  const app = moduleFixture.createNestApplication();

  // Apply the same global settings as in main.ts (or test-specific ones)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  // app.useGlobalFilters(new HttpExceptionFilter()); // Add if needed for e2e filter testing
  // app.useGlobalInterceptors(new TransformInterceptor()); // Add if needed for e2e interceptor testing

  await app.init();
  return app;
}

// Add other test utilities or mock factories here as needed
// export const mockRepository = () => ({ ... });
// export const mockConfigService = () => ({ ... });
