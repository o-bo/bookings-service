import BookingDto from '../../../../domain/bookings/BookingDto';

export default interface DeleteBookingDto extends BookingDto {
  id: string;
}
