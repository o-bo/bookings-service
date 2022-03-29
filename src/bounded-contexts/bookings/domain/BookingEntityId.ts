import UniqueEntityId from '../../../framework/identity/UniqueEntityId';

export default class BookingEntityId extends UniqueEntityId {
  constructor(private id?: number | string) {
    super(id);
  }
}
