import db from "../index";
import Booking from "../../../../../domain/bookings/Booking";
import IDeleteBookingOutputPort from "../../../../../application/bookings/ports/outputs/IDeleteBookingOutputPort";

export default class DeleteBookingPostgresAdapter implements IDeleteBookingOutputPort {
  private static instance: DeleteBookingPostgresAdapter;

  public static getInstance() {
    if (!DeleteBookingPostgresAdapter.instance) {
      this.instance = new DeleteBookingPostgresAdapter();
    }
    return this.instance;
  }

  deleteBooking(booking: Booking): Promise<number> {
    return db('bookings')
      .where({
        id: booking.id.toValue()
      })
      .delete();
  }
}
