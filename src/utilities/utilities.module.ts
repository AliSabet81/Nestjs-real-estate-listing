import { Module } from '@nestjs/common';

import { UidService } from './uid/uid.service';
import { FileService } from './file/file.service';

@Module({
  providers: [FileService, UidService],
  exports: [FileService, UidService],
})
export class UtilitiesModule {}
