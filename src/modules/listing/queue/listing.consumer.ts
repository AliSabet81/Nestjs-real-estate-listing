import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';

import { BaseConsumer } from '../../../core/queue/base.consumer';
import { FileService } from '../../../utilities/file/file.service';
import { LoggerService } from '../../../core/logger/logger.service';
import { LISTING_QUEUE } from '../../../core/queue/queue.constants';
import { UploadListingImageDto } from '../dto/upload-listing-image.dto';

@Processor(LISTING_QUEUE)
export class ListingConsumer extends BaseConsumer {
  constructor(
    logger: LoggerService,
    private readonly fileService: FileService,
  ) {
    super(logger);
  }

  @Process(`createListingImage`)
  createListingImage(job: Job<UploadListingImageDto>) {
    const buffer = this.fileService.base64ToBuffer(job.data.base64File);
    // TODO: upload file to Google Cloud Storage
    // TODO: store respective Google Cloud Storage URL in database
    console.log(`createListingImage job data:`, buffer);
    return job.data;
  }
}
