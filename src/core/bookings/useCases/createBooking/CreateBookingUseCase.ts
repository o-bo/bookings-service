import { GenericAppError } from '../../../_shared/GenericAppError';
import IUseCase from '../../../_shared/IUseCase';
import Result, { left, right } from '../../../_shared/UseCaseResult';

import IBookingRepository from '../../repositories/IBookingRepository';

import Booking from '../../domain/Booking';
import BookingPersonName from '../../domain/BookingPersonName';
import BookingPeopleNumber from '../../domain/BookingPeopleNumber';
import BookingDate from '../../domain/BookingDate';
import BookingTableNumber from '../../domain/BookingTableNumber';
import BookingTotalBilled from '../../domain/BookingTotalBilled';

import CreateBookingDTO from './CreateBookingDTO';
import { CreateBookingResponse } from './CreateBookingResponse';
import { InvalidBookingError } from './CreateBookingErrors';

export default class CreateBookingUseCase
  implements IUseCase<CreateBookingDTO, Promise<CreateBookingResponse>>
{
  private repository: IBookingRepository;

  constructor(repository: IBookingRepository) {
    this.repository = repository;
  }

  async execute(request: CreateBookingDTO): Promise<CreateBookingResponse> {
    const personNameOrError: Result<BookingPersonName> =
      BookingPersonName.create(request.personName);

    const peopleNumberOrError: Result<BookingPeopleNumber> =
      BookingPeopleNumber.create(request.peopleNumber);

    const dateOrError: Result<BookingDate> = BookingDate.create(request.date);

    const tableNumberOrError: Result<BookingTableNumber> =
      BookingTableNumber.create(request.tableNumber);

    const totalBilledOrError: Result<BookingTotalBilled> =
      BookingTotalBilled.create(request.totalBilled);

    const combinedPropsResult = Result.combine([
      personNameOrError,
      peopleNumberOrError,
      dateOrError,
      tableNumberOrError,
      totalBilledOrError
    ]);

    if (combinedPropsResult.isFailure) {
      return left(
        new InvalidBookingError(combinedPropsResult.error)
      ) as CreateBookingResponse;
    }

    const bookingOrError = Booking.create({
      personName: personNameOrError.getValue(),
      peopleNumber: peopleNumberOrError.getValue(),
      date: dateOrError.getValue(),
      tableNumber: tableNumberOrError.getValue(),
      ...(totalBilledOrError.getValue() && {
        totalBilled: totalBilledOrError.getValue()
      }),
      openedStatus: false
    });

    if (bookingOrError.isFailure) {
      return left(
        new InvalidBookingError(combinedPropsResult.error)
      ) as CreateBookingResponse;
    }

    const booking: Booking = bookingOrError.getValue();

    try {
      const createdBooking: Booking | null = await this.repository.save(
        booking
      );

      if (!createdBooking) {
        return left(
          new GenericAppError.UnexpectedError(
            'unable to save and return booking'
          )
        ) as CreateBookingResponse;
      }

      return right(Result.ok<any>(createdBooking));
    } catch (err) {
      return left(
        new GenericAppError.UnexpectedError(err)
      ) as CreateBookingResponse;
    }
  }
}
