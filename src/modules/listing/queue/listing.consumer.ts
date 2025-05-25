import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';

import { ListingService } from '../listing.service';
import { BaseConsumer } from '../../../core/queue/base.consumer';
import { LoggerService } from '../../../core/logger/logger.service';
import { LISTING_QUEUE } from '../../../core/queue/queue.constants';
import { UploadListingImageDto } from '../dto/upload-listing-image.dto';

@Processor(LISTING_QUEUE)
export class ListingConsumer extends BaseConsumer {
  constructor(
    logger: LoggerService,
    private readonly listingService: ListingService,
  ) {
    super(logger);
  }

  @Process(`createListingImage`)
  async createListingImage(job: Job<UploadListingImageDto>) {
    return await this.listingService.createListingImage(job.data);
  }
}
