/* global beforeEach describe it expect */
const request = require('supertest');
const { v4 } = require('uuid');
const knex = require('knex')(
  require('../../db/knexfile')[process.env.NODE_ENV || 'test'],
);

const app = require('../app');

const BOOKING_PARAMS = {
  id: v4(),
  person_name: 'foo',
  people_number: 4,
  date: '2021-10-10',
  table_number: 42,
  opened_status: false,
};

beforeEach(() => knex.raw('truncate table bookings cascade'));

describe('testing-server-routes', () => {
  it('GET /health - success', async () => {
    const { status, body } = await request(app).get('/health');
    expect(status).toEqual(200);
    expect(body).toEqual({
      status: 'ok',
    });
  });

  it('GET /bookings/:id - success', async () => {
    await knex('bookings').insert(BOOKING_PARAMS, ['*']);
    const { status, body } = await request(app).get(
      `/bookings/${BOOKING_PARAMS.id}`,
    );
    expect(status).toEqual(200);
    expect(body).toMatchObject(BOOKING_PARAMS);
  });

  it('GET /bookings/:id - fail - unkown id', async () => {
    await knex('bookings').insert(BOOKING_PARAMS, ['*']);
    const { status, body } = await request(app).get(`/bookings/${v4()}`);
    expect(status).toEqual(404);
    expect(body).toEqual({ errorCode: 'BOOKING_NOT_FOUND' });
  });

  it('GET /bookings - fail - no date passed', async () => {
    await knex('bookings').insert(BOOKING_PARAMS, ['*']);
    const { status, body } = await request(app).get('/bookings');
    expect(status).toEqual(400);
    expect(body).toEqual({ errorCode: 'DATE_MANDATORY' });
  });

  it('GET /bookings - fail - bad date format', async () => {
    await knex('bookings').insert(BOOKING_PARAMS, ['*']);
    const { status, body } = await request(app).get('/bookings?date=erzere');
    expect(status).toEqual(422);
    expect(body).toEqual({ errorCode: 'DATE_BAD_FORMAT' });
  });

  it('GET /bookings - success - date only', async () => {
    await knex('bookings').insert(BOOKING_PARAMS, ['*']);
    await knex('bookings').insert(
      { ...BOOKING_PARAMS, id: v4(), date: '2021-09-09' },
      ['*'],
    );
    const { status, body } = await request(app).get(
      '/bookings?date=2021-10-10',
    );
    expect(status).toEqual(200);
    expect(body).toMatchObject([BOOKING_PARAMS]);
  });

  it('GET /bookings - success - date + table number', async () => {
    await knex('bookings').insert(BOOKING_PARAMS, ['*']);
    await knex('bookings').insert(
      { ...BOOKING_PARAMS, id: v4(), table_number: 666 },
      ['*'],
    );
    const { status, body } = await request(app).get(
      '/bookings?date=2021-10-10&tableNumber=42',
    );
    expect(status).toEqual(200);
    expect(body).toMatchObject([BOOKING_PARAMS]);
  });

  it('GET /bookings - success - date + opened status', async () => {
    await knex('bookings').insert(BOOKING_PARAMS, ['*']);
    await knex('bookings').insert(
      { ...BOOKING_PARAMS, id: v4(), opened_status: true },
      ['*'],
    );
    const { status, body } = await request(app).get(
      '/bookings?date=2021-10-10&openedStatus=false',
    );
    expect(status).toEqual(200);
    expect(body).toMatchObject([BOOKING_PARAMS]);
  });

  it('GET /bookings - success - date + opened status + table number', async () => {
    await knex('bookings').insert(BOOKING_PARAMS, ['*']);
    await knex('bookings').insert(
      { ...BOOKING_PARAMS, id: v4(), opened_status: true },
      ['*'],
    );
    await knex('bookings').insert(
      {
        ...BOOKING_PARAMS, id: v4(), opened_status: true, table_number: 666,
      },
      ['*'],
    );
    const { status, body } = await request(app).get(
      '/bookings?date=2021-10-10&openedStatus=false&tableNumber=42',
    );
    expect(status).toEqual(200);
    expect(body).toMatchObject([BOOKING_PARAMS]);
  });

  it('DELETE /bookings/:id - success', async () => {
    await knex('bookings').insert(BOOKING_PARAMS, ['*']);
    const { status, body } = await request(app).delete(
      `/bookings/${BOOKING_PARAMS.id}`,
    );
    expect(status).toEqual(200);
    expect(body.id).toEqual(BOOKING_PARAMS.id);
  });

  it('DELETE /bookings/:id - fail - unkown id', async () => {
    await knex('bookings').insert(BOOKING_PARAMS, ['*']);
    const { status, body } = await request(app).delete(`/bookings/${v4()}`);
    expect(status).toEqual(404);
    expect(body).toEqual({ errorCode: 'BOOKING_NOT_FOUND' });
  });

  it('POST /bookings - success', async () => {
    const params = {
      personName: 'foo',
      peopleNumber: 4,
      date: '2021-10-10',
      tableNumber: 42,
      openedStatus: false,
    };
    const { status, body } = await request(app).post('/bookings').send(params);
    expect(status).toEqual(201);
    expect(body.id).toBeDefined();
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
    expect(body).toMatchObject(params);
  });

  it('POST /bookings - fail - required data null', async () => {
    const params = {
      personName: null,
      peopleNumber: null,
      date: null,
      tableNumber: null,
      openedStatus: null,
    };
    const { status, body } = await request(app).post('/bookings').send(params);
    expect(status).toEqual(422);
    expect(body.errorCode).toEqual('VALIDATION_ERROR');
    expect(body.errors).toMatchObject([
      { personName: 'REQUIRED' },
      { peopleNumber: 'REQUIRED' },
      { date: 'REQUIRED' },
      { tableNumber: 'REQUIRED' },
      { openedStatus: 'REQUIRED' },
    ]);
  });

  it('POST /bookings - fail - required data undefined', async () => {
    const params = {};
    const { status, body } = await request(app).post('/bookings').send(params);
    expect(status).toEqual(422);
    expect(body.errorCode).toEqual('VALIDATION_ERROR');
    expect(body.errors).toMatchObject([
      { personName: 'REQUIRED' },
      { peopleNumber: 'REQUIRED' },
      { date: 'REQUIRED' },
      { tableNumber: 'REQUIRED' },
      { openedStatus: 'REQUIRED' },
    ]);
  });

  it('POST /bookings - fail - bad date format', async () => {
    const params = {
      personName: 'foo',
      peopleNumber: 4,
      date: 'dqsdqsdsqd',
      tableNumber: 42,
      openedStatus: false,
    };
    const { status, body } = await request(app).post('/bookings').send(params);
    expect(status).toEqual(422);
    expect(body.errorCode).toEqual('VALIDATION_ERROR');
    expect(body.errors).toMatchObject([{ date: 'BAD_FORMAT' }]);
  });

  it('POST /bookings - fail - bad billed amount format', async () => {
    const params = {
      personName: 'foo',
      peopleNumber: 4,
      date: '2021-10-10',
      tableNumber: 42,
      openedStatus: false,
      totalBilled: 'lol',
    };
    const { status, body } = await request(app).post('/bookings').send(params);
    expect(status).toEqual(422);
    expect(body.errorCode).toEqual('VALIDATION_ERROR');
    expect(body.errors).toMatchObject([{ totalBilled: 'BAD_FORMAT' }]);
  });

  it('PUT /bookings/:id - success', async () => {
    const [{ id, created_at: createdAt }] = await knex('bookings').insert(
      BOOKING_PARAMS,
      ['*'],
    );
    const params = {
      personName: 'fooBar',
      peopleNumber: 3,
    };
    const { status, body } = await request(app)
      .put(`/bookings/${id}`)
      .send(params);
    expect(status).toEqual(200);
    expect(body).toMatchObject(params);
    expect(Date.parse(body.updatedAt)).toBeGreaterThan(Date.parse(createdAt));
  });

  it('PUT /bookings/:id - fail - required data null', async () => {
    const [{ id }] = await knex('bookings').insert(
      BOOKING_PARAMS,
      ['*'],
    );
    const params = {
      personName: null,
      peopleNumber: null,
      date: null,
      tableNumber: null,
      openedStatus: null,
    };
    const { status, body } = await request(app)
      .put(`/bookings/${id}`)
      .send(params);
    expect(status).toEqual(422);
    expect(body.errorCode).toEqual('VALIDATION_ERROR');
    expect(body.errors).toMatchObject([
      { personName: 'REQUIRED' },
      { peopleNumber: 'REQUIRED' },
      { date: 'REQUIRED' },
      { tableNumber: 'REQUIRED' },
      { openedStatus: 'REQUIRED' },
    ]);
  });

  it('PUT /bookings/:id - fail - bad date format', async () => {
    const [{ id }] = await knex('bookings').insert(
      BOOKING_PARAMS,
      ['*'],
    );
    const params = {
      personName: 'foo',
      peopleNumber: 4,
      date: 'dqsdqsdsqd',
      tableNumber: 42,
      openedStatus: false,
    };
    const { status, body } = await request(app)
      .put(`/bookings/${id}`)
      .send(params);
    expect(status).toEqual(422);
    expect(body.errorCode).toEqual('VALIDATION_ERROR');
    expect(body.errors).toMatchObject([{ date: 'BAD_FORMAT' }]);
  });

  it('PUT /bookings/:id - fail - bad billed amount format', async () => {
    const [{ id }] = await knex('bookings').insert(
      BOOKING_PARAMS,
      ['*'],
    );
    const params = {
      personName: 'foo',
      peopleNumber: 4,
      date: '2021-10-10',
      tableNumber: 42,
      openedStatus: false,
      totalBilled: 'lol',
    };
    const { status, body } = await request(app)
      .put(`/bookings/${id}`)
      .send(params);
    expect(status).toEqual(422);
    expect(body.errorCode).toEqual('VALIDATION_ERROR');
    expect(body.errors).toMatchObject([{ totalBilled: 'BAD_FORMAT' }]);
  });

  it('PUT /bookings/:id - fail - unkown id', async () => {
    await knex('bookings').insert(BOOKING_PARAMS, ['*']);
    const params = {
      personName: 'foo',
      peopleNumber: 4,
      date: '2021-10-10',
      tableNumber: 42,
      openedStatus: false,
    };
    const { status, body } = await request(app)
      .put(`/bookings/${v4()}`)
      .send(params);
    expect(status).toEqual(404);
    expect(body.errorCode).toEqual('BOOKING_NOT_FOUND');
  });

  it('PUT /bookings/:id - fail - bad id', async () => {
    await knex('bookings').insert(BOOKING_PARAMS, ['*']);
    const params = {
      personName: 'foo',
      peopleNumber: 4,
      date: '2021-10-10',
      tableNumber: 42,
      openedStatus: false,
    };
    const { status, body } = await request(app)
      .put('/bookings/foobar')
      .send(params);
    expect(status).toEqual(422);
    expect(body.errorCode).toEqual('VALIDATION_ERROR');
    expect(body.errors).toMatchObject([{ id: 'BAD_FORMAT' }]);
  });
});
