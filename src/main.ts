import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppLogger } from './infrastructure/logger/app-logger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(AppLogger);
  app.useLogger(logger);

  const config = new DocumentBuilder()
    .setTitle('ToDo API')
    .setDescription(
      'API de gerenciamento de tarefas com NestJS, DDD e Clean Architecture',
    )
    .setVersion('1.0')
    .addBearerAuth() // Habilita JWT no Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);

  logger.log('🚀 App started on port 3000');
  logger.log('📖 Swagger disponível em http://localhost:3000/api/docs');
}
bootstrap();
