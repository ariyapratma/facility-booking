const resolvers = {
  Query: {
    hello: () => "Hello from GraphQL!",
  },
  Mutation: {
    test: (_, { msg }) => `Received message:${msg}`,
  },
};

module.exports = resolvers;
