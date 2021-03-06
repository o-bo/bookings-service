import IVenueOutputPorts from '../../../application/ports/outputs/IVenueOutputPort';
import Venue from '../../../domain/Venue';

export default class VenueInMemoryAdapter implements IVenueOutputPorts {
  private venues: Venue[] = [];

  async addVenue(venue: Venue): Promise<Venue> {
    this.venues.push(venue);
    return Promise.resolve(venue);
  }

  async listVenues(): Promise<Venue[]> {
    return Promise.resolve(this.venues);
  }

  async findById(venueId: string | number): Promise<Venue | undefined> {
    return Promise.resolve(
      this.venues.find((venue) => venueId === venue.id.toValue())
    );
  }
}
