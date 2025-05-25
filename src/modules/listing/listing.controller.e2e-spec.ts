import * as request from 'supertest';
import { server } from '../../../test/setup';
import { join, resolve } from 'path';
import { generateCreateListingPayload } from './test/test-utils';

describe(`ListingController (e2e)`, () => {
  describe(`POST /listing`, () => {
    const {
      label,
      addressLine1,
      addressLine2,
      addressCity,
      addressState,
      addressZipcode,
      price,
      bathrooms,
      bedrooms,
      squareMeters,
    } = generateCreateListingPayload();

    const imagePath = join(__dirname, `./test/images/image-1.png`);

    it(`should return 201 and return created listing`, () => {
      return request(server)
        .post(`/listing`)
        .field(`label`, label)
        .field(`addressLine1`, addressLine1)
        .field(`addressLine2`, addressLine2)
        .field(`addressZipcode`, addressZipcode)
        .field(`addressCity`, addressCity)
        .field(`addressState`, addressState)
        .field(`price`, price)
        .field(`bathrooms`, bathrooms)
        .field(`bedrooms`, bedrooms)
        .field(`squareMeters`, squareMeters)
        .attach(`images`, imagePath)
        .expect(201)
        .expect((res) => {
          const { data } = res.body;
          expect(data.label).toEqual(label);
          expect(data.addressLine1).toEqual(addressLine1);
          expect(data.addressLine2).toEqual(addressLine2);
          expect(data.addressCity).toEqual(addressCity);
          expect(data.addressState).toEqual(addressState);
          expect(data.addressZipcode).toEqual(addressZipcode);
          expect(data.price).toEqual(price);
          expect(data.bathrooms).toEqual(bathrooms);
          expect(data.bedrooms).toEqual(bedrooms);
          expect(data.squareMeters).toEqual(squareMeters);
        })
        .catch((err) => {
          console.log(`err`, err);
        });
    });
    it(`should return 400 when payload is missing`, () => {
      return request(server).post(`/listing`).expect(400);
    });

    it(`should return 400 when a non-number is used for price`, () => {
      return request(server)
        .post(`/listing`)
        .field(`label`, label)
        .field(`addressLine1`, addressLine1)
        .field(`addressLine2`, addressLine2)
        .field(`addressZipcode`, addressZipcode)
        .field(`addressCity`, addressCity)
        .field(`addressState`, addressState)
        .field(`price`, `non-number`)
        .field(`bathrooms`, bathrooms)
        .field(`bedrooms`, bedrooms)
        .field(`squareMeters`, squareMeters)
        .attach(`images`, imagePath)
        .expect(400);
    });

    it(`should return 400 when images are not included`, () => {
      return request(server)
        .post(`/listing`)
        .field(`label`, label)
        .field(`addressLine1`, addressLine1)
        .field(`addressLine2`, addressLine2)
        .field(`addressZipcode`, addressZipcode)
        .field(`addressCity`, addressCity)
        .field(`addressState`, addressState)
        .field(`price`, `non-number`)
        .field(`bathrooms`, bathrooms)
        .field(`bedrooms`, bedrooms)
        .field(`squareMeters`, squareMeters)
        .expect(400);
    });

    it(`should return 400 when more than 2 images attached`, () => {
      return request(server)
        .post(`/listing`)
        .field(`label`, label)
        .field(`addressLine1`, addressLine1)
        .field(`addressLine2`, addressLine2)
        .field(`addressZipcode`, addressZipcode)
        .field(`addressCity`, addressCity)
        .field(`addressState`, addressState)
        .field(`price`, `non-number`)
        .field(`bathrooms`, bathrooms)
        .field(`bedrooms`, bedrooms)
        .field(`squareMeters`, squareMeters)
        .attach(`images`, imagePath)
        .attach(`images`, imagePath)
        .attach(`images`, imagePath)
        .expect(400);
    });

    it(`should return 400 when invalid file used`, () => {
      const invalidImagePath = resolve(__dirname, `./test/test-utils.ts`);
      return request(server)
        .post(`/listing`)
        .field(`label`, label)
        .field(`addressLine1`, addressLine1)
        .field(`addressLine2`, addressLine2)
        .field(`addressZipcode`, addressZipcode)
        .field(`addressCity`, addressCity)
        .field(`addressState`, addressState)
        .field(`price`, `non-number`)
        .field(`bathrooms`, bathrooms)
        .field(`bedrooms`, bedrooms)
        .field(`squareMeters`, squareMeters)
        .attach(`images`, invalidImagePath)
        .expect(400);
    });
  });
});
