import { Injectable } from '@nestjs/common';

import { ListingProducer } from './queue/listing.producer';
import { CreateListingDto } from './dto/create-listing.dto';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class ListingService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly listingQueue: ListingProducer,
  ) {}

  async create({
    data,
    images,
  }: {
    data: CreateListingDto;
    images: Express.Multer.File[];
  }) {
    for (const image of images) {
      await this.listingQueue.createListingImage(image);
    }
    return await this.databaseService.listing.create({
      data,
    });
  }

  async findAll() {
    return await this.databaseService.listing.findMany();
  }
}
