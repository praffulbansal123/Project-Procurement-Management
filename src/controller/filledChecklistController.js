import logger from "../logger/logger.js";
import { fillChecklist } from "../services/filledChecklistServices.js";

export const fillChecklistHandler = async (req, res, next) => {
    try {
        const orderId = req.params.orderId;
        const input = req.body;
        const payload = req.decodedToken;
        const image = req.files;

        const filledChecklist = await fillChecklist(input, payload, orderId, image);

        return res.status(201).send({ status: true, message: "checklist filled successfully", data: filledChecklist });

    } catch (error) {
        logger.info(error.message);
        next(error);
    }
}