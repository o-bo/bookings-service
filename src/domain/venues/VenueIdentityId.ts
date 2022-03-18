import UniqueEntityId from '../../framework/identity/UniqueEntityId';

export default class VenueEntityId extends UniqueEntityId {
  constructor(private id?: number | string) {
    super(id);
  }
}
