export default interface IBookingRepository {
  // filterBookingsByDate(date: BookingDate): Promise<Array<Booking>>;
  // findBookingById (id: BookingEntityId): Promise<Booking>;
  // deleteBookingById (id: BookingEntityId): Promise<Booking>;
  // exists (email: UserEmail): Promise<boolean>;
  save(booking: any): Promise<any>;
}
