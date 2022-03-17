import Venue from '../../../../domain/venues/Venue';

export default interface IVenueOutputPorts {
  findById(venueId: string | number): Promise<Venue | undefined>;
  addVenue(venue: Venue): Promise<Venue>;
  listVenues(): Promise<Venue[]>;
}
