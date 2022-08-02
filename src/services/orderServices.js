import Order from "../models/orderModel.js";
import createError from "http-errors";
import User from "../models/userModel.js";
import BlankChecklist from "../models/blankChecklist.js";
import mongoose from "mongoose";
const {Types} = mongoose;

/*
* @author Prafful Bansal
* @description Service for creating new order
*/
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
    
    // creating order
    const orderDetails = await Order.create(input);
    return orderDetails;
  } catch (error) {
    throw error;
  }
};

/*
* @author Prafful Bansal
* @description Service for linking blank checklist to order
*/
export const addBlankChecklist = async (orderId, checklistId) => {
  try {

    // validating orderId
    if (!Types.ObjectId.isValid(orderId)) {
      throw createError.NotFound(`Please provide a valid order id`);
    }

    // validating checklistId
    if (!Types.ObjectId.isValid(checklistId)) {
      throw createError.NotFound(`Please provide a valid checklist id`);
    }

    // validating order by orderId
    const order = await Order.findById(orderId);
    if (!order) {
      throw createError.NotFound(`${orderId} does not exist`);
    }

    // validating checklist by checklistId
    const checklist = await BlankChecklist.findById(checklistId);
    if (!checklist) {
      throw createError.NotFound(`${checklistId} does not exist`);
    }

    // verifying clientId from orderId and checklistId
    if (order.clientId.toString() !== checklist.clientId.toString()) {
      throw createError.NotFound(`Can not link this checklist to client`);
    }

    // linking blank checklistId to order
    const updateOrder = await Order.findByIdAndUpdate({ _id: orderId },{ $set: { blankChecklistId: checklistId } },{ new: true });

    return updateOrder;
  } catch (error) {
    throw error;
  }
};

/*
* @author Prafful Bansal
* @description Service for getting orders by status
*/
export const getOrders = async (input,payload) => {
  try {
    
    // validating input status
    if(!["pending", "completed", "dispatched", "confirmed"].includes(input)){
      throw createError.BadRequest(`${input} is not allowed here`)
    }

    // declaring find condition
    const condition = {status : input};

    // updating find condition by adding createdBy key for IM only
    if(payload.role === "inspection manager"){
          
      const inspectionManager = await User.findById(payload.userId)
    
      condition.createdBy = inspectionManager.workingUnder
    }
    
    // Getting all the orders and populating filledChecklistId 
    const orders = await Order.find(condition).populate("filledChecklistId");
    
    return orders;

    } catch(error){
        throw error
    }
};

/*
* @author Prafful Bansal
* @description Auto verification logic
*/
export const verification =  (order) => {
  const {itemType, coolerRequired, paddingRequired, waterProtectionRequired, palletsRequired, sharingAllowed, filledChecklistId} = order 
  const {driverDetails, requirements, category} = filledChecklistId
  const {cooler, padding, compartment, pallets, waterProtection} = requirements;

  // category should be same as itemType
  if(itemType !== category){
      return false;
  }

  // checking all driver details are ok
  for(let key in driverDetails){
      if(driverDetails[key] === false){
          return false;
      }
  }

  // matching all requirements
  if(coolerRequired !== cooler || paddingRequired !== padding || waterProtectionRequired !== waterProtection || sharingAllowed !== compartment || palletsRequired !== pallets){
      return false;
  }

  return true;
}

/*
* @author Prafful Bansal
* @description Service for order verification
*/
export const verifyOrder = async (input) => {
  try {

    // validating orderId
    if(!Types.ObjectId.isValid(input)){
      throw createError.NotFound(`Please provide a valid order id`)
    };

    // validating order by orderId
    const order = await Order.findById(input).populate("filledChecklistId");

    if(!order){
      throw createError.NotFound(`${input} does not exist`)
    };

    // matching the requirements and filledChecklist
    if(!verification(order)){
      return ("some fields are not matching with order requirements");
    };

    // update isVerified and status in order
    const updateVerification = await Order.findByIdAndUpdate({_id : input}, {$set : {isVerified : true, status : "confirmed"}}, {new : true});

    return updateVerification;

  } catch (error) {
    throw error;
  }
};

/*
* @author Prafful Bansal
* @description Service for updating order status
*/
export const updateStatus = async (input, status) => {
  try {

    // validating orderId
    if(!Types.ObjectId.isValid(input)){
      throw createError.NotFound(`Please provide a valid order id`)
    }

    // validating order by orderId
    const order = await Order.findById(input)

    if(!order){
      throw createError.NotFound(`${input} does not exist`)
    }

    // validating order status
    if(order.status === "completed"){
      throw createError.NotAcceptable(`can not update completed order`)
    }

    if(order.status === "confirmed" && status === "completed"){
      throw createError.NotAcceptable(`can not update status as completed as order has not been dispatched`)
    }
      
    if(order.status === status){
      throw createError.NotAcceptable(`order status is already ${status}`)
    }

    // updating order status
    const updatedOrder = await Order.findByIdAndUpdate({_id : input}, {$set : {status : status}}, {new : true});

    return updatedOrder

  } catch (error) {
      throw error;
  }
}

/*
* @author Prafful Bansal
* @description Service for get order status
*/
export const getStatus = async (input, payload) => {
  try {

    // validating clientId
    if(!Types.ObjectId.isValid(input)){
      throw createError.NotFound(`Please provide a valid client id`)
    }

    // validating client by clientId
    const user = await User.findById(input);

    if(!user){
      throw createError.NotFound(`User with id ${input} does not exist`)
    }

    // verifying client 
    if(user._id.toString() !== payload.userId.toString()){
      throw createError.Forbidden(`can not see other users orders`)
    }

    // getting status
    const orders = await Order.find({clientId : input}).select({status : 1});

    if(orders.length === 0){
      return (`No orders found for this client id ${input}`)
    }

    return orders;
      
  } catch (error) {
      throw error;
  }
}