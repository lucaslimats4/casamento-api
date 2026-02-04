import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe());
  
  // Configuração mais flexível de CORS para desenvolvimento
  const allowedOrigins = [
    'http://localhost:8080',
    'http://localhost:3000',
    'https://casamento-site-gamma.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Permite requisições sem origin (ex: Postman, mobile apps)
      if (!origin) return callback(null, true);
      
      // Verifica se a origin está na lista permitida
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // Permite qualquer subdomínio do vercel.app
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  const config = new DocumentBuilder()
    .setTitle('Wedding API')
    .setDescription('API para site de casamento')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
}

// Para desenvolvimento local
if (require.main === module) {
  bootstrap();
}