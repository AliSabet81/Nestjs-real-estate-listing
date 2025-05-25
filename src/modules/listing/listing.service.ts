import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ListingProducer } from './queue/listing.producer';
import { CreateListingDto } from './dto/create-listing.dto';
import { FileService } from '../../utilities/file/file.service';
import { DatabaseService } from '../../database/database.service';
import { UploadListingImageDto } from './dto/upload-listing-image.dto';
// import { GoogleCloudService } from '../../services/google-cloud/google-cloud.service';

@Injectable()
export class ListingService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly listingQueue: ListingProducer,
    private readonly fileService: FileService,
    private readonly configService: ConfigService,
    // private readonly googleCloudService: GoogleCloudService,
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

  async createListingImage(data: UploadListingImageDto) {
    const mimeType = data.mimeType;
    const buffer = this.fileService.base64ToBuffer(data.base64File);
    const bucketName = this.configService.getOrThrow<string>(
      `gcp.buckets.listingImages`,
    );
    // TODO: Uncomment this when if you have a Google Cloud Service
    // const publicUrl = await this.googleCloudService.uploadFile(
    //   bucketName,
    //   buffer,
    //   mimeType,
    // );
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${mimeType}${buffer.length}${Math.random()}`;
    const listingImage = await this.databaseService.listingImage.create({
      data: {
        listingId: data.listingId,
        url: publicUrl,
      },
    });
    console.log(listingImage);
    return listingImage;
  }

  async findAll() {
    return await this.databaseService.listing.findMany();
  }
}
