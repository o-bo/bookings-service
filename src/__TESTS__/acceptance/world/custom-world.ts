import IVenueOutputPorts from '../../../application/venues/ports/outputs/IVenueOutputPort';
import { World } from '@cucumber/cucumber';
import VenueInMemoryAdapter from '../../../infrastructure/spi/storage/in-memory/venues/VenueInMemoryAdapter';

export interface CucumberWorldConstructorParams {
  venueRepository: IVenueOutputPorts;
}

export class CustomWorld extends World {
  private venueRepository: IVenueOutputPorts = new VenueInMemoryAdapter();
}
