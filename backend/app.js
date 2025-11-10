var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
require("dotenv").config();

const mongoose = require("mongoose");
mongoose
  .connect(process.env.DB_CONNECTION_STRING)
  .then(() => console.log("MongoDb connected"))
  .catch((error) => console.log("MongoDb connection error", error));

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const { error } = require("console");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

async function createApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  console.log(
    `GraphQL ready at http://localhost:${process.env.PORT || 4000}${
      server.graphqlPath
    }`
  );
}

createApolloServer().catch((error) =>
  console.log("GraphQL server error", error)
);

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
