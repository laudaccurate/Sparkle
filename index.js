const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const { sessionSecret, mongoURL } = require("./config/keys");
const pug = require("pug");

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(express.static(__dirname + "/public"));

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

// connect to database
mongoose.Promise = global.Promise;
mongoose.connect(mongoURL, { useMongoClient: true });
const db = mongoose.connection;
db.once("open", () => console.log("Success: Connected to Database"));
db.on("error", () => console.log("Error: Error conecting to Database"));

// use sessions to track user login
app.use(
  session({
    secret: sessionSecret,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    })
  })
);
require("./models");
const User = mongoose.model('User');

app.use( async(req, res, next) => {
  if (req.session.userId) {
    const user = await User.findOne({_id: req.session.userId});
    res.locals.user = user;
    return next();
  }

  return next();
});

require("./routes")(app);

// handle 404s
app.use((req, res, next) => {
  const error = new Error("oops..... not found");
  error.status = 404;
  return next(error);
});

// error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.render('error', {error});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
