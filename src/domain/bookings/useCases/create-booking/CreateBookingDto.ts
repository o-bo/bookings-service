import BookingDto from '../../entities/BookingDto';

export default interface CreateBookingDto extends BookingDto {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}
