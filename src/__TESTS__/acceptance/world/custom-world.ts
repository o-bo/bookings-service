import IVenueOutputPorts from '../../../bounded-contexts/venues/application/ports/outputs/IVenueOutputPort';
import { World } from '@cucumber/cucumber';
import VenueInMemoryAdapter from '../../../bounded-contexts/venues/repositories/in-memory/venues/VenueInMemoryAdapter';

export interface CucumberWorldConstructorParams {
  venueRepository: IVenueOutputPorts;
}

export class CustomWorld extends World {
  private venueRepository: IVenueOutputPorts = new VenueInMemoryAdapter();
}
