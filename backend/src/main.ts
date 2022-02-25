import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
    const logger = new Logger(bootstrap.name);
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.enableShutdownHooks();
    const config = app.get(ConfigService);
    const port = config.get<number>('API_PORT');
    const swaggerConfig = new DocumentBuilder()
        .setTitle('Rent car')
        .setDescription('The cars API description')
        .setVersion('1.0')
        .addTag('Rent car')
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('swagger', app, document);
    await app.listen(port || 3000, () => {
        logger.log(`Application started on port: ${port}`);
    });
}
bootstrap();
