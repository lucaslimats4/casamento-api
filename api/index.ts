import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';

let app: any;

async function createApp() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors({
      origin: process.env.FRONTEND_URL || 'http://localhost:8080',
      credentials: true,
    });

    const config = new DocumentBuilder()
      .setTitle('Wedding API')
      .setDescription('API para site de casamento')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.init();
  }
  return app;
}

export default async (req: any, res: any) => {
  const app = await createApp();
  const server = app.getHttpAdapter().getInstance();
  return server(req, res);
};