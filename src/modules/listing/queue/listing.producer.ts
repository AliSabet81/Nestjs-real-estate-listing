import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';

import { LISTING_QUEUE } from '../../../core/queue/queue.constants';
import { UploadListingImageDto } from '../dto/upload-listing-image.dto';

@Injectable()
export class ListingProducer {
  constructor(@InjectQueue(LISTING_QUEUE) private listingQueue: Queue) {}

  async uploadListingImage(payload: UploadListingImageDto) {
    return await this.listingQueue.add(`createListingImage`, payload);
  }
}
