import DomainEvent from './DomainEvent';
import AggregateRoot from './AggregateRoot';
import UniqueEntityId from './UniqueEntityId';

export default class DomainEventsManager {
  private static handlersMap: { [key: string]: any[] } = {};

  private static markedAggregates: AggregateRoot<any>[] = [];

  /**
   * @method markAggregateForDispatch
   * @static
   * @desc Called by aggregate root objects that have created domain
   * events to eventually be dispatched when the infrastructure commits
   * the unit of work.
   */

  public static markAggregateForDispatch(aggregate: AggregateRoot<any>): void {
    const aggregateFound = !!this.findMarkedAggregateById(aggregate.id);

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate);
    }
  }

  /**
   * @method dispatchAggregateEvents
   * @static
   * @private
   * @desc Call all of the handlers for any domain events on this aggregate.
   */

  private static dispatchAggregateEvents<T>(aggregate: AggregateRoot<T>): void {
    aggregate.domainEvents.forEach((event: DomainEvent) =>
      this.dispatch(event)
    );
  }

  /**
   * @method removeAggregateFromMarkedDispatchList
   * @static
   * @desc Removes an aggregate from the marked list.
   */

  private static removeAggregateFromMarkedDispatchList<T>(
    aggregate: AggregateRoot<T>
  ): void {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate));

    this.markedAggregates.splice(index, 1);
  }

  /**
   * @method findMarkedAggregateByID
   * @static
   * @desc Finds an aggregate within the list of marked aggregates.
   */

  private static findMarkedAggregateById(
    id: UniqueEntityId
  ): AggregateRoot<any> | undefined {
    return this.markedAggregates.find((aggregate) => aggregate.id.equals(id));
  }

  /**
   * @method dispatchEventsForAggregate
   * @static
   * @desc When all we know is the ID of the aggregate, call this
   * in order to dispatch any handlers subscribed to events on the
   * aggregate.
   */

  public static dispatchEventsForAggregate<T>(entity: AggregateRoot<T>): void {
    const aggregate = this.findMarkedAggregateById(entity.id);

    if (aggregate) {
      this.dispatchAggregateEvents<T>(aggregate);
      aggregate.clearEvents();
      this.removeAggregateFromMarkedDispatchList<T>(aggregate);
    }
  }

  /**
   * @method register
   * @static
   * @desc Register a handler to a domain event.
   */

  public static register(
    callback: (event: DomainEvent) => Promise<void>,
    eventClassName: string
  ): void {
    if (!this.handlersMap.hasOwnProperty(eventClassName)) {
      this.handlersMap[eventClassName] = [];
    }
    this.handlersMap[eventClassName].push(callback);
  }

  /**
   * @method clearHandlers
   * @static
   * @desc Useful for testing.
   */

  public static clearHandlers(): void {
    this.handlersMap = {};
  }

  /**
   * @method clearMarkedAggregates
   * @static
   * @desc Useful for testing.
   */

  public static clearMarkedAggregates(): void {
    this.markedAggregates = [];
  }

  /**
   * @method dispatch
   * @static
   * @desc Invokes all of the subscribers to a particular domain event.
   */

  private static dispatch(event: DomainEvent): void {
    const eventClassName: string = event.constructor.name;

    if (this.handlersMap.hasOwnProperty(eventClassName)) {
      const handlers: any[] = this.handlersMap[eventClassName];
      for (let handler of handlers) {
        handler(event);
      }
    }
  }
}
