import BookingDto from '../../../../domain/bookings/BookingDto';

export default interface CreateBookingDto extends BookingDto {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}
