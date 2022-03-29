import VenueDto from './VenueDto';
import AggregateRoot from '../../framework/aggregate/AggregateRoot';
import UniqueEntityId from '../../framework/identity/UniqueEntityId';
import VenueAddress from './VenueAddress';
import VenueName from './VenueName';
import VenueEntityId from './VenueIdentityId';

interface VenueProps {
  name: VenueName;
  address: VenueAddress;
}

interface TableProps {
  number: number;
  capacity: number;
}

export default class Venue extends AggregateRoot<VenueProps> {
  #tables: TableProps[] = [];

  get venueEntityId(): VenueEntityId {
    return this.id;
  }

  get name(): VenueName {
    return this.props.name;
  }

  get address(): VenueAddress {
    return this.props.address;
  }

  get tables(): TableProps[] {
    return this.#tables;
  }

  private constructor(props: VenueProps, id?: UniqueEntityId) {
    super(props, id);
  }

  public addTable(tableData: TableProps) {
    this.#tables.push(tableData);
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

  toDto(): VenueDto {
    return {
      name: this.name.toValue(),
      address: this.address.toValue()
    };
  }

  toPersistence(): any {
    return {};
  }
}
