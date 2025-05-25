import { Injectable } from '@nestjs/common';

import { ListingProducer } from './queue/listing.producer';
import { CreateListingDto } from './dto/create-listing.dto';
import { FileService } from '../../utilities/file/file.service';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class ListingService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly listingQueue: ListingProducer,
    private readonly fileService: FileService,
  ) {}

  async create({
    data,
    images,
  }: {
    data: CreateListingDto;
    images: Express.Multer.File[];
  }) {
    const listing = await this.databaseService.listing.create({
      data,
    });
    for (const image of images) {
      await this.listingQueue.uploadListingImage({
        base64File: this.fileService.bufferToBase64(image.buffer),
        mimeType: image.mimetype,
        listingId: listing.id,
      });
    }
    return listing;
  }

  async findAll() {
    return await this.databaseService.listing.findMany();
  }
}
