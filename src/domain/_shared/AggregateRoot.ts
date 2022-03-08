// import { IDomainEvent } from './events/IDomainEvent';
// import { DomainEvents } from './events/DomainEvents';

import Entity from './Entity';
import UniqueEntityID from './UniqueEntityId';

export default abstract class AggregateRoot<ENT> extends Entity<ENT> {
  // private _domainEvents: IDomainEvent[] = [];

  get id(): UniqueEntityID {
    return this._id;
  }

  // get domainEvents(): IDomainEvent[] {
  //   return this._domainEvents;
  // }

  // protected addDomainEvent(domainEvent: IDomainEvent): void {
  //   // Add the entities event to this aggregate's list of entities events
  //   this._domainEvents.push(domainEvent);
  //   // Add this aggregate instance to the entities event's list of aggregates who's
  //   // events it eventually needs to dispatch.
  //   DomainEvents.markAggregateForDispatch(this);
  //   // Log the entities event
  //   this.logDomainEventAdded(domainEvent);
  // }

  // public clearEvents(): void {
  //   this._domainEvents.splice(0, this._domainEvents.length);
  // }

  // private logDomainEventAdded(domainEvent: IDomainEvent): void {
  //   const thisClass = Reflect.getPrototypeOf(this);
  //   const domainEventClass = Reflect.getPrototypeOf(domainEvent);
  //   console.info(
  //     `[Domain Event Created]:`,
  //     thisClass!.constructor.name,
  //     '==>',
  //     domainEventClass!.constructor.name
  //   );
  // }
}
