import UniqueEntityId from '../identity/UniqueEntityId';
import AggregateRoot from '../aggregate/AggregateRoot';

export default class DomainEvent {
  public dateTimeOccurred: Date;

  public entity: AggregateRoot<any>;

  constructor(entity: AggregateRoot<any>) {
    this.dateTimeOccurred = new Date();
    this.entity = entity;
  }

  getAggregateId(): UniqueEntityId {
    return this.entity.id;
  }
}
