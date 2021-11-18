import Entity from '../../_shared/Entity';
import UniqueEntityId from '../../_shared/UniqueEntityId';

export default class BookingId extends Entity<any> {
  get id(): UniqueEntityId {
    return this._id;
  }

  private constructor(id?: UniqueEntityId) {
    super(null, id);
  }
}
