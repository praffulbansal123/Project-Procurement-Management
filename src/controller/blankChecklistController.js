import logger from "../logger/logger.js";
import { createBlankChecklist, getChecklist } from "../services/blankChecklistServices.js";

export const registerBlankChecklist = async (req, res, next) => {
  try {
    const payload = req.decodedToken;
    const input = req.body;

    const data = await createBlankChecklist(input, payload);

    return res.status(201).json(data);
  } catch (err) {
    logger.info(err.message);
    next(err);
  }
};

export const getChecklistByClientIdHandler = async (req, res, next) => {
  try {
    const clientId = req.params.clientId;

    const data = await getChecklist(clientId);

    return res.status(200).send({status: true, numbers : data.length, data: data});

  } catch (err) {
    logger.info(err.message);
    next(err);
  }
};
