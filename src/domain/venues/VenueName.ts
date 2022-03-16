import ValueObject from '../../framework/ValueObject';

interface VenueNameProps {
  value: string;
}

export default class VenueName extends ValueObject<VenueNameProps> {
  private constructor(props: VenueNameProps) {
    super(props);
  }

  toValue(): string {
    return this.props.value;
  }

  public static create(name: string): VenueName {
    return new VenueName({ value: name });
  }
}
