Feature: Create a booking

  A customer wants to create a new booking in a specific venue

  Background:
    Given there are venues:
      | id  | name        | address                                  |
      | abc | etoile      | 1 bis rue de l union 64600 Anglet        |
      | def | le triangle | 64 avenue des champs elysees 75000 Paris |
    Given there are available tables:
      |  |  | number | venueId | capacity |  |
      |  |  | 1      | abc     | 4        |  |
      |  |  | 2      | abc     | 6        |  |
      |  |  | 1      | def     | 2        |  |
      |  |  | 2      | def     | 4        |  |

  Scenario Outline: there are available tables
      Given I am customer "<personName>"
      When I book a table at "<venueName>", "<venueAddress>", for "<peopleNumber>" people, on "<date>"
      Then the booking is done
      And I should be booked on table number "<tableNumber>"
      Examples:
        | personName     | peopleNumber | date                   | tableNumber | venueName   | venueAddress                             |
        | Jean Rochefort | 4            | 2022-03-23T12:30+01:00 | 1           | etoile      | 1 bis rue de l union 64600 Anglet        |
        | Lou Bega       | 6            | 2022-03-23T12:30+01:00 | 2           | etoile      | 1 bis rue de l union 64600 Anglet        |
        | Ricky Martin   | 2            | 2022-03-23T12:30+01:00 | 1           | le triangle | 64 avenue des champs elysees 75000 Paris |
