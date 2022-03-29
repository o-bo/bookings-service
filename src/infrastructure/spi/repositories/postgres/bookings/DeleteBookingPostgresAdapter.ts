import db from "../index";
import Booking from "../../../../../domain/bookings/Booking";
import IDeleteBookingOutputPort from "../../../../../application/bookings/ports/outputs/IDeleteBookingOutputPort";

export default class DeleteBookingPostgresAdapter implements IDeleteBookingOutputPort {
  private static _instance: DeleteBookingPostgresAdapter;

  public static instance() {
    if (!DeleteBookingPostgresAdapter._instance) {
      this._instance = new DeleteBookingPostgresAdapter();
    }
    return this._instance;
  }

  async deleteBooking(booking: Booking): Promise<void> {
    await db('bookings')
      .where({
        id: booking.id.toValue()
      })
      .delete();
  }
}
