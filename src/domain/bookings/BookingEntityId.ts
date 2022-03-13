import UniqueEntityId from '../../framework/UniqueEntityId';

export default class BookingEntityId extends UniqueEntityId {
  private constructor(private id?: number | string) {
    super(id);
  }
}
