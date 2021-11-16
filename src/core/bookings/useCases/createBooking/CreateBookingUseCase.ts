import { v4 } from 'uuid';

import { GenericAppError } from '../../../_shared/GenericAppError';
import IUseCase from '../../../_shared/IUseCase';
import Result, { left, right } from '../../../_shared/UseCaseResult';

import IBookingRepository from '../../repositories/IBookingRepository';

import BookingPersonName from '../../domain/BookingPersonName';
import BookingPeopleNumber from '../../domain/BookingPeopleNumber';
import BookingDate from '../../domain/BookingDate';
import BookingTableNumber from '../../domain/BookingTableNumber';
import BookingOpenedStatus from '../../domain/BookingOpenedStatus';
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

    const openedStatusOrError: Result<BookingOpenedStatus> =
      BookingOpenedStatus.create(request.openedStatus);

    const totalBilledOrError: Result<BookingTotalBilled> =
      BookingTotalBilled.create(request.totalBilled);

    const combinedPropsResult = Result.combine([
      personNameOrError,
      peopleNumberOrError,
      dateOrError,
      tableNumberOrError,
      openedStatusOrError,
      totalBilledOrError
    ]);

    if (combinedPropsResult.isFailure) {
      return left(
        new InvalidBookingError(combinedPropsResult.error)
      ) as CreateBookingResponse;
    }

    const params = {
      id: v4()
      // ...(personName && { person_name: personName }),
      // ...(peopleNumber && { people_number: peopleNumber }),
      // ...(date && { date }),
      // ...(tableNumber && { table_number: tableNumber }),
      // ...(openedStatus && { opened_status: openedStatus }),
      // ...(totalBilled && { total_billed: totalBilled })
    };

    try {
      const createdBooking = await this.repository.save(params);

      return right(Result.ok<any>(createdBooking));
    } catch (err) {
      return left(
        new GenericAppError.UnexpectedError(err)
      ) as CreateBookingResponse;
    }
  }
}
