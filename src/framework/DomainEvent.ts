import UniqueEntityId from './UniqueEntityId';
import AggregateRoot from './AggregateRoot';

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
