import BookingCreatedEvent from '../../../domain/bookings/events/BookingCreatedEvent';
import IHandleDomainEvent from '../../../framework/domain-event/IHandleDomainEvent';
import DomainEventsManager from '../../../framework/domain-event/DomainEventsManager';

export default class AfterBookingCreated implements IHandleDomainEvent {
  constructor() {
    this.setupSubscriptions();
  }

  private async onBookingCreatedEvent(
    event: BookingCreatedEvent
  ): Promise<void> {
    const { entity } = event;

    try {
      // Do whatever necessary like publish on pub/sub system or send slack message
      console.log('Booking Created !!!', entity.toDto());
    } catch (err) {}
  }

  setupSubscriptions(): void {
    DomainEventsManager.register(
      this.onBookingCreatedEvent.bind(this),
      BookingCreatedEvent.name
    );
  }
}
