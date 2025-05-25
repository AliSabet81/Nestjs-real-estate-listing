import { Job } from 'bull';
import { Process, Processor, OnQueueFailed } from '@nestjs/bull';

import { LISTING_QUEUE } from '../../../core/queue/queue.constants';
import { BaseConsumer } from '../../../core/queue/base.consumer';
import { LoggerService } from '../../../core/logger/logger.service';

@Processor(LISTING_QUEUE)
export class ListingConsumer extends BaseConsumer {
  constructor(logger: LoggerService) {
    super(logger);
  }

  @Process(`createListingImage`)
  createListingImage(job: Job<Express.Multer.File>) {
    console.log(`createListingImage filename:`, job.data.originalname);
    throw new Error(`Test error`);
    return job.data;
  }

  @OnQueueFailed()
  onError(job: Job<string>, error: any) {
    super.onError(job, error);
    // do something else here
  }
}
