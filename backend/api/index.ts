import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import serverless from 'serverless-http';
import { AppModule } from '../src/app.module';

let app: any;

async function bootstrap() {
  if (!app) {
    const nestApp = await NestFactory.create(AppModule);

    // Enable CORS for Vercel frontend
    nestApp.enableCors({
      origin: true,
      credentials: true,
    });

    // Enable validation pipes globally
    nestApp.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await nestApp.init();
    app = nestApp;
  }
  return app;
}

export const handler = serverless(async (req: any, context: any) => {
  const app = await bootstrap();
  return app.getHttpAdapter().getInstance()(req, context);
});
