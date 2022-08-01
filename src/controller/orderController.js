import { createOrder, addBlankChecklist, getOrders } from "../services/orderServices.js";
import logger from "../logger/logger.js";

export const createOrderHandler = async (req, res, next) => {
  try {
    const input = req.body;
    const payload = req.decodedToken;

    const order = await createOrder(input, payload);

    return res.status(201).send({status: true,message: "Order created successfully",orderDetails: order,});

  } catch (error) {
    logger.info(error.message);
    next(error);
  }
};

export const linkBlankChecklistHandler = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const checklistId = req.params.checklistId;

    const updatedOrder = await addBlankChecklist(orderId, checklistId);

    return res.status(201).send({status: true,message: "Order is updated and blank Checklist is linked",data: updatedOrder,});

  } catch (error) {
    logger.info(error.message);
    next(error);
  }
};

export const getOrdersHandler = async (req, res, next) => {
    try {
        const status = req.query.status

        const orders = await getOrders(status); 

        return res.status(201).send({status: true, number: orders.length, data: orders})
        
    } catch (error) {
        logger.info(error.message);
        next(error);
    }
}


