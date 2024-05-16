import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from "./common/exception/http.exception.filter";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { CommonResultInterceptor } from "./common/interceptor/common.result.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('jobty API 명세서')
    .setDescription('')
    .setVersion('0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-ui/index', app, document);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new CommonResultInterceptor());
  await app.listen(3000);
}
bootstrap();
