import app from "./index.js";
import logger from "../src/logger/logger.js";

app.listen(app.get("port"), () => {
  logger.info(`Server listening on port ${app.get("port")}`);
});
