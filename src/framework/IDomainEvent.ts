import UniqueEntityId from './UniqueEntityId';

export default interface IDomainEvent {
  dateTimeOccurred: Date;
  getAggregateId(): UniqueEntityId;
}
