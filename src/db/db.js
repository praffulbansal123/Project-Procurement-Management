import mongoose from "mongoose";
import logger from "../logger/logger.js";

/*
* @author Prafful Bansal
* @description Database configuration
*/
class Database {
  // Initialize the database connection
  static async init() {
    const dsn = process.env.MONGOOSE_URL;

    try {
      await mongoose.connect(dsn);
      logger.info("Database initialized successfully");
    } catch (error) {
      logger.info("Database connection error: " + error.message);
    }
  }
}

export default Database;
