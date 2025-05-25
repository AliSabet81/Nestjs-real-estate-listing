import { Injectable } from '@nestjs/common';
import { CreateListingDto } from './dto/create-listing.dto';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class ListingService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createListingDto: CreateListingDto) {
    return 'creating';
  }

  findAll() {
    return 'find all';
  }
}
