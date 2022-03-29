import assert from 'node:assert';

import { DataTable, Given, setWorldConstructor } from '@cucumber/cucumber';

import Venue from '../../../bounded-contexts/venues/domain/Venue';
import { CustomWorld } from '../world';
import IVenueOutputPorts from '../../../bounded-contexts/venues/application/ports/outputs/IVenueOutputPort';

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
    ) && expectedVenues.length === allVenues.length
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

Given(/^there are available tables:$/, async function (dataTable: DataTable) {
  const venueRepository: IVenueOutputPorts = this.venueRepository;

  await Promise.all(
    dataTable
      .hashes()
      .map(({ venueId, ...table }) =>
        venueRepository
          .findById(venueId)
          .then((venue: Venue | undefined) => venue!.addTable(table))
      )
  );

  const allVenues = await venueRepository.listVenues();
  assert.equal(allVenues[0].tables.length, 2);
  assert.equal(allVenues[0].tables[0].number, 1);
  assert.equal(allVenues[0].tables[0].capacity, 4);
  assert.equal(allVenues[0].tables[1].number, 2);
  assert.equal(allVenues[0].tables[1].capacity, 6);
  assert.equal(allVenues[1].tables.length, 2);
  assert.equal(allVenues[1].tables[0].number, 1);
  assert.equal(allVenues[1].tables[0].capacity, 2);
  assert.equal(allVenues[1].tables[1].number, 2);
  assert.equal(allVenues[1].tables[1].capacity, 4);
});
