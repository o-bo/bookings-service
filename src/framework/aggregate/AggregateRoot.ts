import DomainEventsManager from '../domain-event/DomainEventsManager';

import Entity from '../identity/Entity';
import UniqueEntityID from '../identity/UniqueEntityId';
import DomainEvent from '../domain-event/DomainEvent';

export default abstract class AggregateRoot<ENT> extends Entity<ENT> {
  private _domainEvents: DomainEvent[] = [];

  get id(): UniqueEntityID {
    return this._id;
  }

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent(domainEvent: DomainEvent): void {
    // Add the entities event to this aggregate's list of entities events
    this._domainEvents.push(domainEvent);
    // Add this aggregate instance to the entities event's list of aggregates who's
    // events it eventually needs to dispatch.
    DomainEventsManager.markAggregateForDispatch(this);
    // Log the entities event
    this.logDomainEventAdded(domainEvent);
  }

  public clearEvents(): void {
    this._domainEvents.splice(0, this._domainEvents.length);
  }

  private logDomainEventAdded(domainEvent: DomainEvent): void {
    const thisClass = Reflect.getPrototypeOf(this);
    const domainEventClass = Reflect.getPrototypeOf(domainEvent);
    console.info(
      `[Domain Event Created]:`,
      thisClass!.constructor.name,
      '==>',
      domainEventClass!.constructor.name
    );
  }
}
