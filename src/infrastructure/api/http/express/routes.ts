import express, { Request, Response, Router } from 'express';
import { validate } from 'uuid';
import BookingPostgresAdapter from '../../../spi/storage/postgres/bookings/BookingPostgresAdapter';
import CreateBookingRestAdapter from './bookings/CreateBookingRestAdapter';
import DeleteBookingRestAdapter from './bookings/DeleteBookingRestAdapter';
import DeleteBookingInputPort from '../../../../application/bookings/ports/inputs/delete-booking/DeleteBookingInputPort';
import { keysToCamel } from '../../../../framework/utils';
import db from '../../../spi/storage/postgres';
import CreateBookingInputPort from '../../../../application/bookings/ports/inputs/create-booking/CreateBookingInputPort';

const router: Router = express.Router();

const asyncHandler = (fn: any) => (req: Request, res: Response, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* GET /health */
router.get('/health', async (req: Request, res: Response) =>
  res.status(200).send({ status: 'ok' })
);

/*
GET /bookings
curl -X GET -H "Content-Type: application/json" \
    localhost:3000/bookings\?date\=2021\-10\-10
*/
router.get(
  '/bookings/',
  asyncHandler(async (req: Request, res: Response) => {
    const { date, tableNumber, openedStatus } = req.query;

    if (!date) {
      return res.status(400).send({
        type: 'error',
        reason: 'REQUIRED_ERROR',
        message: 'DATE_MANDATORY'
      });
    }

    if (Number.isNaN(Date.parse(date as string))) {
      return res.status(422).send({
        type: 'error',
        reason: 'VALIDATION_ERROR',
        message: 'DATE_BAD_FORMAT'
      });
    }

    const bookings = await db('bookings')
      .where({
        date,
        ...(tableNumber && { table_number: tableNumber }),
        ...(openedStatus && { opened_status: openedStatus })
      })
      .select();

    return res.status(200).send(bookings);
  })
);

/*
GET /bookings/id
curl -X GET -H "Content-Type: application/json" \
    localhost:3000/bookings/id
*/
router.get(
  '/bookings/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const [booking] = await db('bookings')
      .where({
        id: req.params.id
      })
      .select();

    if (!booking) {
      return res.status(404).send({
        type: 'error',
        reason: 'NOT_FOUND_ERROR',
        message: 'BOOKING_NOT_FOUND'
      });
    }

    return res.status(200).send(booking);
  })
);

/*
PUT /bookings/:id
curl -X PUT -H "Content-Type: application/json" \
    -d '{"personName": "Bobby"}' \
    localhost:3000/bookings/1
*/
router.put(
  '/bookings/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const errors = [];
    const {
      personName,
      peopleNumber,
      date,
      tableNumber,
      openedStatus,
      totalBilled
    } = req.body;
    const { id } = req.params;

    if (!validate(id)) errors.push({ id: 'BAD_FORMAT' });
    if (typeof personName !== 'undefined' && !personName) {
      errors.push({ personName: 'REQUIRED' });
    }
    if (typeof peopleNumber !== 'undefined' && !peopleNumber) {
      errors.push({ peopleNumber: 'REQUIRED' });
    }
    if (typeof date !== 'undefined' && !date) errors.push({ date: 'REQUIRED' });
    if (date && Number.isNaN(Date.parse(date)))
      errors.push({ date: 'BAD_FORMAT' });
    if (typeof tableNumber !== 'undefined' && tableNumber === null) {
      errors.push({ tableNumber: 'REQUIRED' });
    }
    if (typeof openedStatus !== 'undefined' && openedStatus === null) {
      errors.push({ openedStatus: 'REQUIRED' });
    }
    if (typeof totalBilled !== 'undefined' && !Number.isInteger(totalBilled)) {
      errors.push({ totalBilled: 'BAD_FORMAT' });
    }

    if (errors.length > 0) {
      return res.status(422).send({
        type: 'error',
        reason: 'VALIDATION_ERROR',
        errors
      });
    }

    const params = {
      ...(personName && { person_name: personName }),
      ...(peopleNumber && { people_number: peopleNumber }),
      ...(date && { date }),
      ...(tableNumber && { table_number: tableNumber }),
      ...(openedStatus && { opened_status: openedStatus }),
      ...(totalBilled && { total_billed: totalBilled })
    };

    const [updatedBooking] = (await db('bookings')
      .where({
        id
      })
      .update(params, ['*'])) as unknown as Array<any>;

    if (!updatedBooking) {
      return res.status(404).send({
        type: 'error',
        reason: 'NOT_FOUND_ERROR'
      });
    }

    return res.status(200).send(keysToCamel(updatedBooking));
  })
);

/*
DEL /bookings/id
curl -X DELETE -H "Content-Type: application/json" \
    localhost:3000/bookings/7dfddd85-fa8b-49e8-a7de-ac623b4da4a2
*/
router.delete(
  '/bookings/:id',
  asyncHandler(async (req: Request, res: Response) => {
    // const controller = container.get<DeleteBookingRestAdapter>(
    //   SERVICE_IDENTIFIER.DELETE_BOOKING_REST_ADAPTER
    // );

    const bookingOutputPort = new BookingPostgresAdapter();
    const deleteBookingInputPort = new DeleteBookingInputPort(
      bookingOutputPort
    );
    const controller = new DeleteBookingRestAdapter(deleteBookingInputPort);
    return controller.execute(req, res);
  })
);

/*
POST /bookings
curl -X POST -H "Content-Type: application/json" \
    -d '{"personName": "FooBar","peopleNumber":4,"date":"2021-10-10","tableNumber":42}' \
    localhost:3000/bookings
*/
router.post(
  '/bookings/',
  asyncHandler(async (req: Request, res: Response) => {
    // const controller = container.get<CreateBookingRestAdapter>(
    //   SERVICE_IDENTIFIER.CREATE_BOOKING_REST_ADAPTER
    // );

    const bookingOutputPort = new BookingPostgresAdapter();
    const createBookingInputPort = new CreateBookingInputPort(
      bookingOutputPort
    );
    const controller = new CreateBookingRestAdapter(createBookingInputPort);
    return controller.execute(req, res);
  })
);

export default router;
