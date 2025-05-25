import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const username = await configService.get('redis.username');
        const password = await configService.get('redis.password');
        return {
          redis: {
            host: await configService.get('redis.host'),
            port: await configService.get('redis.port'),
            ...(username && { username }),
            ...(password && { password }),
          },
        };
      },
      inject: [ConfigService],
    }),
    BullBoardModule.forRoot({
      route: `/queues`,
      adapter: ExpressAdapter,
    }),
  ],
})
export class QueueModule {}
