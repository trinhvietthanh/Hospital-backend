import { NestFactory } from '@nestjs/core';
import { AppModule } from '@modules/app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { IConfig } from 'config';
import * as apiSpecConverter from 'api-spec-converter';
import * as fs from 'fs';
import { CONFIG } from '@modules/config/config.provider';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  // const logger = app.get(Logger);

  // app.useLogger(logger);

  initializeSwagger(app);

  const port = process.env.PORT || '8888';
  await app.listen(parseInt(port), process.env.HOST || '0.0.0.0');
}

async function initializeSwagger(app: INestApplication) {
  const config = app.get<IConfig>(CONFIG);
  const serviceName = config.get<string>('service.name');
  const serviceDescription = config.get<string>('service.description');
  const apiVersion = config.get<string>('service.apiVersion');

  const options = new DocumentBuilder()
    .setTitle(`${serviceName} API spec`)
    .setDescription(serviceDescription)
    .setVersion(apiVersion)
    .addServer(
      `${config.get('server.swaggerSchema')}://${config.get(
        'server.hostname',
      )}`,
    )
    .addApiKey(null, 'access-token')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  writeSwaggerJson(`${process.cwd()}`, document);
  SwaggerModule.setup(
    config.get<string>('service.docsBaseUrl'),
    app,
    document,
    {
      swaggerOptions: {
        displayOperationId: true,
      },
    },
  );
}

const writeSwaggerJson = (path: string, document) => {
  const swaggerFile = `${path}/swagger.json`;
  const swaggerFile2 = `${path}/swagger-2.0.json`;
  fs.writeFileSync(swaggerFile, JSON.stringify(document, null, 2), {
    encoding: 'utf8',
  });

  apiSpecConverter
    .convert({
      from: 'openapi_3',
      to: 'swagger_2',
      source: swaggerFile,
    })
    .then((converted) => {
      fs.writeFileSync(swaggerFile2, converted.stringify(), {
        encoding: 'utf8',
      });
    });
};

bootstrap();
