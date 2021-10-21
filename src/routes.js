const express = require('express');
const { v4: generateUUIDV4, validate: isValidUUID } = require('uuid');
const { types } = require('pg');

/* Fix : Override date parser to avoid returning a full ISO8061 string representation https://github.com/knex/knex/issues/3071 */
const DATE_OID = 1082;
const parseDate = (value) => value;
types.setTypeParser(DATE_OID, parseDate);
/* /Fix */

const knex = require('knex')(require('../db/knexfile')[process.env.NODE_ENV]);

const { keysToCamel } = require('./utils');

const router = express.Router();

/* GET /health */
router.get('/health', async (req, res) => res.status(200).send({ status: 'ok' }));

/*
GET /bookings
curl -X GET -H "Content-Type: application/json" \
    localhost:3000/bookings\?date\=2021\-10\-10
*/
router.get('/bookings/', async (req, res) => {
  const { date, tableNumber, openedStatus } = req.query;

  if (!date) return res.status(400).send({ type: 'error', reason: 'REQUIRED_ERROR', message: 'DATE_MANDATORY' });

  if (Number.isNaN(Date.parse(date))) { return res.status(422).send({ type: 'error', reason: 'VALIDATION_ERROR', message: 'DATE_BAD_FORMAT' }); }

  const bookings = await knex('bookings')
    .where({
      date,
      ...(tableNumber && { table_number: tableNumber }),
      ...(openedStatus && { opened_status: openedStatus }),
    })
    .select();

  return res.status(200).send(bookings);
});

/*
GET /bookings/id
curl -X GET -H "Content-Type: application/json" \
    localhost:3000/bookings/id
*/
router.get('/bookings/:id', async (req, res) => {
  const [booking] = await knex('bookings')
    .where({
      id: req.params.id,
    })
    .select();

  if (!booking) return res.status(404).send({ type: 'error', reason: 'NOT_FOUND_ERROR', message: 'BOOKING_NOT_FOUND' });

  return res.status(200).send(booking);
});

/*
PUT /bookings/:id
curl -X PUT -H "Content-Type: application/json" \
    -d '{"personName": "Bobby"}' \
    localhost:3000/bookings/1
*/
router.put('/bookings/:id', async (req, res) => {
  const errors = [];
  const {
    personName,
    peopleNumber,
    date,
    tableNumber,
    openedStatus,
    totalBilled,
  } = req.body;
  const { id } = req.params;

  if (!isValidUUID(id)) errors.push({ id: 'BAD_FORMAT' });
  if (typeof personName !== 'undefined' && !personName) { errors.push({ personName: 'REQUIRED' }); }
  if (typeof peopleNumber !== 'undefined' && !peopleNumber) { errors.push({ peopleNumber: 'REQUIRED' }); }
  if (typeof date !== 'undefined' && !date) errors.push({ date: 'REQUIRED' });
  if (date && Number.isNaN(Date.parse(date))) errors.push({ date: 'BAD_FORMAT' });
  if (typeof tableNumber !== 'undefined' && tableNumber === null) { errors.push({ tableNumber: 'REQUIRED' }); }
  if (typeof openedStatus !== 'undefined' && openedStatus === null) { errors.push({ openedStatus: 'REQUIRED' }); }
  if (typeof totalBilled !== 'undefined' && !Number.isInteger(totalBilled)) { errors.push({ totalBilled: 'BAD_FORMAT' }); }

  if (errors.length > 0) { return res.status(422).send({ type: 'error', reason: 'VALIDATION_ERROR', errors }); }

  const params = {
    ...(personName && { person_name: personName }),
    ...(peopleNumber && { people_number: peopleNumber }),
    ...(date && { date }),
    ...(tableNumber && { table_number: tableNumber }),
    ...(openedStatus && { opened_status: openedStatus }),
    ...(totalBilled && { total_billed: totalBilled }),
  };

  const [updatedBooking] = await knex('bookings')
    .where({
      id,
    })
    .update(params, ['*']);

  if (!updatedBooking) { return res.status(404).send({ type: 'error', reason: 'NOT_FOUND_ERROR' }); }

  return res.status(200).send(keysToCamel(updatedBooking));
});

/*
DEL /bookings/id
curl -X DELETE -H "Content-Type: application/json" \
    localhost:3000/bookings/7dfddd85-fa8b-49e8-a7de-ac623b4da4a2
*/
router.delete('/bookings/:id', async (req, res) => {
  const deletedBooking = await knex('bookings')
    .where({
      id: req.params.id,
    })
    .delete();

  if (deletedBooking === 0) { return res.status(404).send({ type: 'error', reason: 'NOT_FOUND_ERROR', message: 'BOOKING_NOT_FOUND' }); }

  return res.status(200).send({
    id: req.params.id,
  });
});

/*
POST /bookings
curl -X POST -H "Content-Type: application/json" \
    -d '{"personName": "FooBar","peopleNumber":4,"date":"2021-10-10","tableNumber":42}' \
    localhost:3000/bookings
*/
router.post('/bookings/', async (req, res) => {
  const errors = [];
  const {
    personName,
    peopleNumber,
    date,
    tableNumber,
    openedStatus,
    totalBilled,
  } = req.body;

  if (typeof personName === 'undefined' || !personName) { errors.push({ personName: 'REQUIRED' }); }
  if (typeof peopleNumber === 'undefined' || !peopleNumber) { errors.push({ peopleNumber: 'REQUIRED' }); }
  if (typeof date === 'undefined' || !date) errors.push({ date: 'REQUIRED' });
  if (date && Number.isNaN(Date.parse(date))) errors.push({ date: 'BAD_FORMAT' });
  if (typeof tableNumber === 'undefined' || tableNumber === null) { errors.push({ tableNumber: 'REQUIRED' }); }
  if (typeof openedStatus === 'undefined' || openedStatus === null) { errors.push({ openedStatus: 'REQUIRED' }); }
  if (typeof totalBilled !== 'undefined' && !Number.isInteger(totalBilled)) { errors.push({ totalBilled: 'BAD_FORMAT' }); }

  if (errors.length > 0) { return res.status(422).send({ type: 'error', reason: 'VALIDATION_ERROR', errors }); }

  const params = {
    id: generateUUIDV4(),
    ...(personName && { person_name: personName }),
    ...(peopleNumber && { people_number: peopleNumber }),
    ...(date && { date }),
    ...(tableNumber && { table_number: tableNumber }),
    ...(openedStatus && { opened_status: openedStatus }),
    ...(totalBilled && { total_billed: totalBilled }),
  };

  const [insertedBooking] = await knex('bookings').insert(params, ['*']);

  return res.status(201).send(keysToCamel(insertedBooking));
});

module.exports = router;
