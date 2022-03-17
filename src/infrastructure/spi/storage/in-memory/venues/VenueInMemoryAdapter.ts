import IVenueOutputPorts from '../../../../../application/venues/ports/outputs/IVenueOutputPort';
import Venue from '../../../../../domain/venues/Venue';

export default class VenueInMemoryAdapter implements IVenueOutputPorts {
  private venues: Venue[] = [];

  addVenue(venue: Venue): Promise<Venue> {
    this.venues.push(venue);
    return Promise.resolve(venue);
  }

  listVenues(): Promise<Venue[]> {
    return Promise.resolve(this.venues);
  }

  findById(venueId: string | number): Promise<Venue | undefined> {
    return Promise.resolve(
      this.venues.find((venue) => venueId === venue.id.toValue())
    );
  }
}
