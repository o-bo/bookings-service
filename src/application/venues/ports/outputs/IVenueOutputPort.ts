import Venue from '../../../../domain/venues/Venue';

export default interface IVenueOutputPorts {
  addVenue(venue: Venue): Promise<Venue>;
  listVenues(): Promise<Venue[]>;
}
