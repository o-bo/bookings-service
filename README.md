# Bookings Service

## Presentation

The booking service is responsible to manage bookings for our restaurant.
It offers dedicated methods to create, edit, validate, delete and access the bookings.

Available REST endpoints and database structure are described here after.

## TODO - Objectives

- The service is aimed to be deployed world wide. For that reason it must manage the restaurants in the database and provide a way to filter the requests by a given restaurant identifier.

- Moreover, as the service will be used heavily every day, we must implement a caching strategy using a in-memory cache tools : Redis.

- The first version of this service has been developed in a rush for serving a particular need ; now it will be maintained every day by tens of developers. Before adding more and more features, we must go through the current implementation and analyze the different ways to improve the code : make it less coupled, more readable and testable.

## Tech stack

### USER STORY 01 : configure the service

The service is served by a NodeJS application using Javascript.
The REST API is exposed using Express middlewares.
The database is Postgres db and the queries are built using knex.js ; a docker-compose starts the database.
Integration tests are written using Jest and Supertest and available in the __TESTS__ directory.

## Database

### USER STORY 11 : Modeling the bookings in the database

The database stores the bookings in a dedicated table "bookings".
A booking is structured by :

- a unique id (type of UUID) : identify the booking in the restaurant - REQUIRED
- a person_name (type of STRING) : store the name of the person that booked the reservation - REQUIRED
- a people_number (type of INTEGER) : store the expected number of people - OPTIONAL
- a date (type of DATE) : day of the booking, format is YYYY-mm-dd - REQUIRED
- a table_number (type of INTEGER) : identify the table in the restaurant - REQUIRED
- a opened_status (type of BOOLEAN) : TRUE means the customers are eating, FALSE means the customers have paid and the service is over or the service did not start yet - REQUIRED, DEFAULT TO FALSE
- a total_billed (type of INTEGER) : amount of the booking in cents, can be updated during the service according to the orders - OPTIONAL

## REST API

### USER STORY 21 : Creating a booking

The service exposes a HTTP POST /bookings endpoint that is responsible to create a new booking entry in the bookings table according to the body of the request.
The body is passed in JSON format.
The request responds with HTTP code 201 and the created entity or with HTTP code 422 and an error object in case of errors inserting the booking in the database.

### USER STORY 22 : Updating a booking

The service exposes a HTTP PUT /bookings/:id endpoint that is responsible to update an existing booking in the bookings table according to the body of the request.
The body is passed in JSON format.
The request responds with HTTP code 200 and the updated entity or with HTTP code 422 and an error object in case of error inserting the booking in the database.

### USER STORY 23 : Deleting a booking

The service exposes a HTTP DELETE /bookings/:id endpoint that is responsible to delete an existing booking in the bookings table.
The request responds with HTTP code 200 and the deleted entity or with HTTP code 404 if the passed id does not refer to an existing booking entry.

### USER STORY 24 : Listing the bookings

The service exposes a HTTP GET /bookings?date=YYYY-mm-dd endpoint that is responsible to list the bookings for a given day.
The request responds with HTTP code 200 and the list of the corresponding bookings or with HTTP code 400 if the date parameter is missing.
If no entries are found for the given date, the service returns an empty array.

The endpoint accepts a second attribute : tableNumber that will allow the service to filter the bookings for a given table ; this attribute is optional.
The endpoint accepts a third attribute : opened_status that will allow the service to filter the bookings for a given status ; this attribute is optional.

### USER STORY 25 : Retrieving a booking

The service exposes a HTTP GET /bookings/:id endpoint that is responsible to retrieve a specific booking.
The request responds with HTTP code 200 and the corresponding booking or with HTTP code 404 if the entry does not exist for the given id.
