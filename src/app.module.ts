import { Module } from '@nestjs/common';

import { CoreModule } from './core/core.module';
import { UtilitiesModule } from './utilities/utilities.module';
import { ListingModule } from './modules/listing/listing.module';

@Module({
  imports: [CoreModule, ListingModule, UtilitiesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
