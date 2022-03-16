import VenueDto from './VenueDto';
import AggregateRoot from '../../framework/AggregateRoot';
import UniqueEntityId from '../../framework/UniqueEntityId';
import VenueAddress from './VenueAddress';
import VenueName from './VenueName';
import VenueEntityId from './VenueIdentityId';

interface VenueProps {
  name: VenueName;
  address: VenueAddress;
}

export default class Venue extends AggregateRoot<VenueProps> {
  get venueEntityId(): VenueEntityId {
    return this.id;
  }

  get name(): VenueName {
    return this.props.name;
  }

  get address(): VenueAddress {
    return this.props.address;
  }

  private constructor(props: VenueProps, id?: UniqueEntityId) {
    super(props, id);
  }

  public static init(venueDto: VenueDto, id?: string | number) {
    const venueName = VenueName.create(venueDto.name);
    const venueAddress = VenueAddress.create(venueDto.address);
    return new Venue(
      {
        name: venueName,
        address: venueAddress
      },
      new VenueEntityId(id)
    );
  }
}
