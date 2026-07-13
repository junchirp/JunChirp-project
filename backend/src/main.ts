import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';
import helmet from 'helmet';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import nextModule = require('next');
import { NextServer } from 'next/dist/server/next';
import { ValidationPipe } from './common/pipes/validation/validation.pipe';
import { NextFunction, Request, Response } from 'express';
import { CsrfSessionIdMiddleware } from './csrf/middleware/csrf-session-id/csrf-session-id.middleware';
import { CsrfProtectionMiddleware } from './csrf/middleware/csrf-protection/csrf-protection.middleware';

async function bootstrap(): Promise<void> {
  const PORT = Number(process.env.PORT) || 3000;
  const server = express();
  server.set('trust proxy', true);

  server.listen(PORT, '0.0.0.0');

  const dev = process.env.NODE_ENV !== 'production';
  const frontendDir = path.resolve(__dirname, '../../frontend');
  const next = nextModule as unknown as (opts: {
    dev: boolean;
    dir: string;
  }) => NextServer;
  const nextApp = next({ dev, dir: frontendDir });
  await nextApp.prepare();
  const handle = nextApp.getRequestHandler();
  let isReady = false;

  server.use((req, res, nextFunc) => {
    if (req.url.startsWith('/api') || req.url.startsWith('/swagger')) {
      return nextFunc();
    }
    return handle(req, res);
  });

  server.use((_req, res, nextFunc) => {
    if (!isReady) {
      return res.status(503).send('Server is starting...');
    }
    nextFunc();
  });

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  const sessionMiddleware = app.get(CsrfSessionIdMiddleware);
  const csrfMiddleware = app.get(CsrfProtectionMiddleware);

  app.use(helmet());
  app.enableCors({
    origin: [],
    credentials: true,
  });

  app.use(cookieParser(process.env.CSRF_SECRET ?? 'default_secret'));
  app.use((req: Request, res: Response, nextFunc: NextFunction) =>
    sessionMiddleware.use(req, res, nextFunc),
  );
  app.use((req: Request, res: Response, nextFunc: NextFunction) =>
    csrfMiddleware.use(req, res, nextFunc),
  );

  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('JunChirp')
    .setDescription('The JunChirp API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.init();
  isReady = true;

  console.log(`Server started on port ${PORT}`);
}
bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
