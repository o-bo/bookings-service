export default interface IBookingRepository {
  // filterBookingsByDate(date: BookingDate): Promise<User>;
  // findBookingById (id: BookingEntityId): Promise<User>;
  // exists (email: UserEmail): Promise<boolean>;
  save(booking: any): Promise<void>;
}
