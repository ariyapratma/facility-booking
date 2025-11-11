const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    role: String!
  }

  type openingHours {
    dayofWeek: String!
    open: String!
    close: String!
  }

  type Facility {
    id: ID!
    name: String!
    description: String!
    location: String!
    capacity: Int!
    hourlyRate: Int!
    imageUrl: String!
    openingHours: [openingHours]
    createdAt: String!
  }

  type Booking {
    id: ID!
    facility: Facility!
    user: User!
    date: String!
    startTime: String!
    endTime: String!
    duration: Int!
    status: String!
    purpose: String!
    approvedBy: User!
    createdAt: String!
  }

  input BookingInput {
    facilityId: ID!
    userId: ID!
    date: String!
    startTime: String!
    endTime: String!
    duration: Int!
    status: String!
    purpose: String!
  }

  type Query {
    facilities(
      search: String
      location: String
      minCapacity: Int
      maxRate: Int
      availableDate: String
    ): [Facility!]!

    facility(id: ID!): Facility
    booking(facilityId: ID!, userId: ID!, date: String): [Booking!]!

    myBooking: [Booking!]!
  }

  type Mutation {
    createBooking(input: BookingInput!): Booking!
    cancelBooking(bookingId: ID!): Booking!
  }
`;

module.exports = typeDefs;
