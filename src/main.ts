import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function start() {
  const app = await NestFactory.create(AppModule);
  const PORT = 5350;

  app.enableCors({
    // origin: 'https://ezpromo.app',
    origin: 'http://localhost:5173',
    credentials: true,
  });

  app.use(cookieParser());
  app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(PORT, () => {
    console.log(`Сервер запустился, используется порт: ${PORT}`);
  });
}

start();
