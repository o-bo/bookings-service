import express, { NextFunction, Request, Response, Router } from 'express';
import { validate } from 'uuid';
import CreateBookingExpressAdapter from './routes/CreateBookingExpressAdapter';
import DeleteBookingExpressAdapter from './routes/DeleteBookingExpressAdapter';
import DeleteBookingInputPort from '../../../../application/ports/inputs/delete-booking/DeleteBookingInputPort';
import { keysToCamel } from '../../../../../../framework/utils/utils';
import db from '../../../spi/repositories/postgres';
import CreateBookingInputPort from '../../../../application/ports/inputs/create-booking/CreateBookingInputPort';
import PersistBookingPostgresAdapter from '../../../spi/repositories/postgres/PersistBookingPostgresAdapter';
import DeleteBookingPostgresAdapter from '../../../spi/repositories/postgres/DeleteBookingPostgresAdapter';
import FetchBookingByIdPostgresAdapter from '../../../spi/repositories/postgres/FetchBookingByIdPostgresAdapter';

const router: Router = express.Router();

/* GET /health */
router.get('/health', (req: Request, res: Response) =>
  res.status(200).send({ status: 'ok' })
);

/*
GET /bookings
curl -X GET -H "Content-Type: application/json" \
    localhost:3000/bookings\?date\=2021\-10\-10
*/
router.get('/bookings/', (req: Request, res: Response, next: NextFunction) => {
  const { date, tableNumber, openedStatus } = req.query;

  if (!date) {
    res.status(400).send({
      type: 'error',
      reason: 'REQUIRED_ERROR',
      message: 'DATE_MANDATORY'
    });
  }

  if (Number.isNaN(Date.parse(date as string))) {
    res.status(422).send({
      type: 'error',
      reason: 'VALIDATION_ERROR',
      message: 'DATE_BAD_FORMAT'
    });
  }

  db('bookings')
    .where({
      date,
      ...(tableNumber && { table_number: tableNumber }),
      ...(openedStatus && { opened_status: openedStatus })
    })
    .select()
    .then((bookings) => res.status(200).send(bookings))
    .catch(next);
});

/*
GET /bookings/id
curl -X GET -H "Content-Type: application/json" \
    localhost:3000/bookings/id
*/
router.get(
  '/bookings/:id',
  (req: Request, res: Response, next: NextFunction) => {
    db('bookings')
      .where({
        id: req.params.id
      })
      .select()
      .then(([booking]) => {
        if (!booking) {
          res.status(404).send({
            type: 'error',
            reason: 'NOT_FOUND_ERROR',
            message: 'BOOKING_NOT_FOUND'
          });
        }

        res.status(200).send(booking);
      })
      .catch(next);
  }
);

/*
PUT /bookings/:id
curl -X PUT -H "Content-Type: application/json" \
    -d '{"personName": "Bobby"}' \
    localhost:3000/bookings/1
*/
router.put(
  '/bookings/:id',
  (req: Request, res: Response, next: NextFunction) => {
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

    db('bookings')
      .where({
        id
      })
      .update(params, ['*'])
      .then((result: any) => {
        const [updatedBooking] = result as unknown as Array<any>;
        if (!updatedBooking) {
          res.status(404).send({
            type: 'error',
            reason: 'NOT_FOUND_ERROR'
          });
        }

        res.status(200).send(keysToCamel(updatedBooking));
      })
      .catch(next);
  }
);

/*
DEL /bookings/id
curl -X DELETE -H "Content-Type: application/json" \
    localhost:3000/bookings/7dfddd85-fa8b-49e8-a7de-ac623b4da4a2
*/
router.delete(
  '/bookings/:id',
  (req: Request, res: Response, next: NextFunction) => {
    // const controller = container.get<DeleteBookingRestAdapter>(
    //   SERVICE_IDENTIFIER.DELETE_BOOKING_REST_ADAPTER
    // );

    const deleteBookingPostgresAdapter = new DeleteBookingPostgresAdapter();
    const fetchBookingByIdPostgresAdapter =
      new FetchBookingByIdPostgresAdapter();
    const deleteBookingInputPort = new DeleteBookingInputPort(
      deleteBookingPostgresAdapter,
      fetchBookingByIdPostgresAdapter
    );
    const controller = new DeleteBookingExpressAdapter(deleteBookingInputPort);
    controller.execute(req, res, next);
  }
);

/*
POST /bookings
curl -X POST -H "Content-Type: application/json" \
    -d '{"personName": "FooBar","peopleNumber":4,"date":"2021-10-10","tableNumber":42}' \
    localhost:3000/bookings
*/
router.post('/bookings/', (req: Request, res: Response, next: NextFunction) => {
  // const controller = container.get<CreateBookingRestAdapter>(
  //   SERVICE_IDENTIFIER.CREATE_BOOKING_REST_ADAPTER
  // );

  const createBookingPostgresAdapter = new PersistBookingPostgresAdapter();
  const createBookingInputPort = new CreateBookingInputPort(
    createBookingPostgresAdapter
  );
  const controller = new CreateBookingExpressAdapter(createBookingInputPort);
  controller.execute(req, res, next);
});

export default router;
