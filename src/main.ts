import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('OTP_Verfication_task')
    .setDescription('API for sending and verifying OTPs using email + Redis')
    .setVersion('1.0')
    .addTag('OTP')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT);
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log(`Swagger is available at http://localhost:${PORT}/api`);
}
bootstrap();
