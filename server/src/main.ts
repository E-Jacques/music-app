import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * https://stackoverflow.com/questions/68134195/nest-js-how-to-use-kafka-consumer-with-websocket
   * app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'KAFKA_CLIENT_ID',
        brokers: ['KAFKA_URIS'],
      },
    },
  });

  await app.startAllMicroservices();
  await app
    .listen(port))
    .then(() => {
      Logger.log(`API Listen on ${port}`);
    })
    .catch((error: any) => Logger.error(error));
   */

  app.enableCors({
    allowedHeaders: [
      'content-type',
      'authorization',
      'Access-Control-Allow-Headers',
      'accept',
      'content-length',
    ],
    origin: 'http://localhost:4200',
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
