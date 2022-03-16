import assert from 'node:assert';

import { DataTable, Given, setWorldConstructor } from '@cucumber/cucumber';

import Venue from '../../../domain/venues/Venue';
import { CustomWorld } from '../world';
import IVenueOutputPorts from '../../../application/venues/ports/outputs/IVenueOutputPort';

setWorldConstructor(CustomWorld);

function assertAllVenuesAreEqual(allVenues: Venue[], expectedVenues: any[]) {
  assert.equal(
    true,
    expectedVenues.every((expectedVenue) =>
      allVenues.some(
        (venue) =>
          venue.id.toValue() === expectedVenue.id &&
          venue.name.toValue() === expectedVenue.name &&
          venue.address.toValue() === expectedVenue.address
      )
    )
  );
}

Given(/^there are venues:$/, async function (dataTable: DataTable) {
  const venueRepository: IVenueOutputPorts = this.venueRepository;

  await Promise.all(
    dataTable.hashes().map(({ id, ...venueDto }) => {
      const venue: Venue = Venue.init(venueDto, id);
      return venueRepository.addVenue(venue);
    })
  );

  const allVenues = await venueRepository.listVenues();

  assertAllVenuesAreEqual(allVenues, dataTable.hashes());
});

Given(/^there are available tables:$/, function (dataTable: DataTable) {
  throw new Error('Not implemented yet');
});
