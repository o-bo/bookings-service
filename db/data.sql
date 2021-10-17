CREATE USER postgres WITH PASSWORD changeme;
CREATE DATABASE bookings_service_test;
GRANT ALL PRIVILEGES ON DATABASE bookings_service_test to postgres;
CREATE DATABASE bookings_service;
GRANT ALL PRIVILEGES ON DATABASE bookings_service to postgres;