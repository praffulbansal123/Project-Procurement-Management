import {createOrder} from '../services/orderServices.js';
import logger from "../logger/logger.js";


export const createOrderHandler = async (req, res, next) => {
    try {
        const input = req.body;
        const payload = req.decodedToken;

        const order = await createOrder(input, payload);
        return res.status(201).send({status: true, message : "Order created successfully", orderDetails: order});
    } catch (error) {
        logger.info(error.message)
        next(error);
    }
}