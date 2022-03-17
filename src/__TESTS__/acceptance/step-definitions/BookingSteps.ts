import { Given, Then, When } from '@cucumber/cucumber';

Given(/^I am customer "([^"]*)"$/, function (personName: string) {
  throw new Error('Not implemented yet');
});

When(
  /^I book a table at "([^"]*)", "([^"]*)", for "([^"]*)" people, on "([^"]*)"$/,
  function (
    venueName: string,
    venueAddress: string,
    peopleNumber: number,
    date: Date
  ) {
    throw new Error('Not implemented yet');
  }
);

Then(/^the booking is done$/, function () {
  throw new Error('Not implemented yet');
});

Then(
  /^I should be booked on table number "([^"]*)"$/,
  function (tableNumber: number) {
    throw new Error('Not implemented yet');
  }
);
