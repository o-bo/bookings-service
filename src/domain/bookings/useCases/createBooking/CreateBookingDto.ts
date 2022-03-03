import BookingDto from '../../domain/BookingDto';

export default interface CreateBookingDto extends BookingDto {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}
