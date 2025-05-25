import helmet from 'helmet';
import { Queue } from 'bull';
import { App } from 'supertest/types';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import { AppModule } from '../src/app.module';
import { CacheService } from '../src/core/cache/cache.service';
import { LISTING_QUEUE } from '../src/core/queue/queue.constants';
import { DatabaseService } from '../src/database/database.service';
import { GoogleCloudService } from '../src/services/google-cloud/google-cloud.service';

let app: INestApplication;
let server: App;
let moduleFixture: TestingModule;
let cache: CacheService;
let database: DatabaseService;
let googleCloudService: DeepMocked<GoogleCloudService>;
let listingQueue: Queue; // <-- add this

beforeAll(async () => {
  moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
    providers: [
      {
        provide: GoogleCloudService,
        useValue: createMock<GoogleCloudService>(),
      },
    ],
  }).compile();

  // Apply consistent set up to main.ts
  app = moduleFixture.createNestApplication();
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Get instances of services
  cache = moduleFixture.get<CacheService>(CacheService);
  database = moduleFixture.get<DatabaseService>(DatabaseService);
  googleCloudService = moduleFixture.get(GoogleCloudService);
  listingQueue = moduleFixture.get<Queue>(`BullQueue_${LISTING_QUEUE}`);

  googleCloudService.uploadFile = jest
    .fn()
    .mockResolvedValue(`https://test.com`);

  await app.init();
  server = app.getHttpServer();
});

afterEach(async () => {
  await database.resetDb();
  await cache.reset();
});

afterAll(async () => {
  await app.close();
});

export { server, app, listingQueue };
