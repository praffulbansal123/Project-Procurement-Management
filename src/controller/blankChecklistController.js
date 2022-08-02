import logger from "../logger/logger.js";
import { createBlankChecklist, getChecklist } from "../services/blankChecklistServices.js";

/*
* @author Prafful Bansal
* @description Create blank checklist 
* @route POST checklist/register/blank
*/
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

/*
* @author Prafful Bansal
* @description Registering filled checklist
* @route GET checklist/get/blank/:clientId
*/
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
