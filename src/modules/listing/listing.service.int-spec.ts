import {
  generateCreateListingPayload,
  generateListingImages,
} from './test/test-utils';
import { ListingService } from './listing.service';
import { app, listingQueue } from '../../../test/setup';
import { DatabaseService } from '../../database/database.service';

describe(`ListingService Integration Tests`, () => {
  let listingService: ListingService;
  let databaseService: DatabaseService;

  beforeAll(async () => {
    listingService = await app.get(ListingService);
    databaseService = await app.get(DatabaseService);
  });

  describe(`create`, () => {
    it(`should create a listing`, async () => {
      const payload = generateCreateListingPayload(); // <-- use this new method
      const listing = await listingService.create({
        data: payload,
        images: [],
      });
      const persistedListing = await databaseService.listing.findUnique({
        where: {
          id: listing.id,
        },
      });
      expect(listing).toEqual(persistedListing);
    });

    it(`should create a listing with images`, async () => {
      const payload = generateCreateListingPayload();
      const images = generateListingImages();
      const listing = await listingService.create({
        data: payload,
        images,
      });
      let inProcessJobs = await listingQueue.getJobs([`active`]);
      while (inProcessJobs.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        inProcessJobs = await listingQueue.getJobs([`active`]);
      }
      const persistedListing = await databaseService.listing.findUnique({
        where: {
          id: listing.id,
        },
      });
      expect(listing).toEqual(persistedListing);
    });
  });
});
