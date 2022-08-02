import Order from "../models/orderModel.js";
import createError from "http-errors";
import FilledChecklist from "../models/filledChecklist.js";
import mongoose from "mongoose";
import { uploadFile } from "../providers/aws.js";
const { Types } = mongoose;

/*
* @author Prafful Bansal
* @description Service for filling blank checklist
*/
export const fillChecklist = async (input, payload, orderId, image) => {
  try {
    if (image.length === 0 || !image) {
      throw createError.BadRequest("image is required");
    }

    // regex for validating image format
    const regexForMimeTypes = /image\/png|image\/jpeg|image\/jpg/;

    // validating image format
    const validImageType = image.filter((x) => regexForMimeTypes.test(x.mimetype) === false);

    if (validImageType.length > 0) {
      throw createError.BadRequest(`${validImageType[0].fieldname} is not a valid image type`);
    }

    // validating orderId
    if (!Types.ObjectId.isValid(orderId)) {
      throw createError.BadRequest(`${orderId} is not a valid order id`);
    }

    // Finding order by orderId
    const order = await Order.findById(orderId);

    if (!order) {
      throw createError.NotFound(`Order ${orderId} not found`);
    }

    // upload image to aws
    if (image[0].fieldname === "halfLoadingImage") {
      const halfLoadingImageUrl = await uploadFile(image[0]);
      const fullLoadingImageUrl = await uploadFile(image[1]);
      input.halfLoadingImage = halfLoadingImageUrl;
      input.fullLoadingImage = fullLoadingImageUrl;
    } else {
      const halfLoadingImageUrl = await uploadFile(image[1]);
      const fullLoadingImageUrl = await uploadFile(image[0]);
      input.halfLoadingImage = halfLoadingImageUrl;
      input.fullLoadingImage = fullLoadingImageUrl;
        
    }

    // adding inspection manager id
    input.inspectedBy = payload.userId;

    // creating filled checklist
    const checklist = await FilledChecklist.create(input);

    // add fill checklist to order
    const allFillChecklistToOrder = await Order.findByIdAndUpdate({ _id: orderId },{ $set: { filledChecklistId: checklist._id}}, { new: true });

    return checklist;
  } catch (error) {
    throw error;
  }
};
