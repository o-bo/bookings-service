import UniqueEntityId from '../../framework/UniqueEntityId';

export default class VenueEntityId extends UniqueEntityId {
  constructor(private id?: number | string) {
    super(id);
  }
}
