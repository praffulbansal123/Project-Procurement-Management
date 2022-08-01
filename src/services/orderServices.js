import Order from "../models/orderModel.js";
import createError from "http-errors";
import User from "../models/userModel.js";
import BlankChecklist from "../models/blankChecklist.js";
import mongoose from "mongoose";
const {Types} = mongoose;

export const createOrder = async (input, payload) => {
  try {
    // does client exist
    const client = await User.findById(input.clientId);
    if (!client) {
      throw createError.NotFound(`${input.clientId} does not exist`);
    }
    // does client role is valid
    if (client.role !== "client") {
      throw createError.NotAcceptable(`${input.clientId} is ${client.role}`);
    }

    // adding creator id
    input.createdBy = payload.userId;

    const orderDetails = await Order.create(input);
    return orderDetails;
  } catch (error) {
    throw error;
  }
};

export const addBlankChecklist = async (orderId, checklistId) => {
  try {
    if (!Types.ObjectId.isValid(orderId)) {
      throw createError.NotFound(`Please provide a valid order id`);
    }

    if (!Types.ObjectId.isValid(checklistId)) {
      throw createError.NotFound(`Please provide a valid checklist id`);
    }

    // validating order id
    const order = await Order.findById(orderId);
    if (!order) {
      throw createError.NotFound(`${orderId} does not exist`);
    }

    // validating checklist id
    const checklist = await BlankChecklist.findById(checklistId);
    if (!checklist) {
      throw createError.NotFound(`${checklistId} does not exist`);
    }

    if (order.clientId.toString() !== checklist.clientId.toString()) {
      throw createError.NotFound(`Can not link this checklist to client`);
    }

    const updateOrder = await Order.findByIdAndUpdate({ _id: orderId },{ $set: { blankChecklistId: checklistId } },{ new: true });

    return updateOrder;
  } catch (error) {
    throw error;
  }
};

export const getOrders = async (input) => {
    try {

        if(!["pending", "completed", "dispatched", "confirmed"].includes(input)){
            throw createError.BadRequest(`${input} is not allowed here`)
           }
           const condition = {status : input};
    
           const orders = await Order.find(condition).populate("filledChecklistId");
    
           return orders;

    } catch(error){
        throw error
    }
}