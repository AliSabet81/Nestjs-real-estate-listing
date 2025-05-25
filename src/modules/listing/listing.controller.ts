import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { ListingService } from './listing.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { MaxFileCountValidationPipe } from '../../common/pipes/max-file-count-validation/max-file-count-validation.pipe';

@Controller('listing')
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  @Post()
  @UseInterceptors(FilesInterceptor(`images`))
  create(
    @Body() createListingDto: CreateListingDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: `.(png|jpeg|jpg)` }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
        ],
      }),
      new MaxFileCountValidationPipe(10),
    )
    files: Express.Multer.File[],
  ) {
    return this.listingService.create({
      data: createListingDto,
      images: files,
    });
  }

  @Get()
  findAll() {
    return this.listingService.findAll();
  }
}
