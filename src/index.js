import express from "express";
import createError from "http-errors";
import morgan from "morgan";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import helmet from "helmet";
import Database from "../src/db/db.js";
import userRouter from "./routes/userRoute.js";
import checklistRouter from "./routes/checklistRoute.js";
import orderRouter from "./routes/orderRoute.js";
import multer from "multer"

// dotenv configuration
dotenv.config();

// express app configuration
const app = express();

const port = parseInt(process.env.PORT);

app.set("port", port);

// Implementing helmet middleware
app.use(helmet());

// Implementing morgan middleware
app.use(morgan("dev"));

// Implementing express session middleware
app.use(session({
  secret : process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie : {
      maxAge: 2 * 24 * 60 * 60 * 1000,
  },
  store:  MongoStore.create({
      mongoUrl : process.env.MONGOOSE_URL,
      ttl: parseInt(process.env.TTL)
  })
}));

// Parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer().any())

// Database initialized
Database.init();

// diverting user request to user router
app.use("/user", userRouter);

// diverting checklist request to checklist router
app.use("/checklist", checklistRouter);

// diverting order request to order router
app.use("/order", orderRouter);

// checking invalid route
app.use(async (req, res, next) => {
  next(createError.NotFound("This route does not exits"));
});

// Intializing error-handling
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({ status: false, status1: err.status || 500, mssg: err.message });
});

export default app;
