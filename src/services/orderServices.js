import Order from '../models/orderModel.js';
import createError from 'http-errors';
import User from '../models/userModel.js';
import blankChecklist from '../models/blankChecklist.js';
// import {Types} from 'mongoose';


 export const createOrder = async (input, payload) => {
    try {
            // does client exist
            const client = await User.findById(input.clientId);
            if(!client ) {
                throw new createError.NotFound(`${input.clientId} does not exist`)
            }
            // does client role is valid
            if(client.role !== 'client') {
                throw new createError.NotAcceptable(`${input.clientId} is ${client.role}`)
            }
            
            // adding creator id
            input.createdBy = payload.userId;

            const orderDetails = await Order.create(input)
            return orderDetails
    } catch (error) {
       throw error
    }
}