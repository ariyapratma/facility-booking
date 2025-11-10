const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    hello: String!
  }

  type Mutation {
    test(msg: String): String
  }
`;

module.exports = typeDefs;
