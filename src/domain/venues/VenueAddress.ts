import ValueObject from '../../framework/ValueObject';

interface VenueAddressProps {
  value: string;
}

export default class VenueAddress extends ValueObject<VenueAddressProps> {
  private constructor(props: VenueAddressProps) {
    super(props);
  }

  toValue(): string {
    return this.props.value;
  }

  public static create(address: string): VenueAddress {
    return new VenueAddress({ value: address });
  }
}
