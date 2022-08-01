import User from "../models/userModel.js";
import createError from "http-errors";
import BlankChecklist from "../models/blankChecklist.js";
import mongoose from "mongoose";
const {Types} = mongoose;

export const createBlankChecklist = async (input, payload) => {
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
    // input requirements present
    if (input.requirements === undefined || Object.keys(input.requirements).length === 0)
      throw createError.BadRequest(`Requirements can not be empty`);

    // adding creator ID
    input.createdBy = payload.userId;

    const checklist = await BlankChecklist.create(input);

    return checklist;
  } catch (error) {
    throw error;
  }
};

export const getChecklist = async (input) => {
  try {
    if (!Types.ObjectId.isValid(input))
      throw createError.BadRequest("Please provide a valid clientId");

    // does client exist
    const client = await User.findById(input);
    if (!client) throw createError.NotFound(`${input} does not exist`);

    // does client role is valid
    if (client.role !== "client") {
      throw createError.NotAcceptable(`${input} is ${client.role}`);
    }

    const checklists = await BlankChecklist.find({ clientId: input });

    if (checklists.length === 0) {
      throw createError.NotFound(`Checklist not found for ${input}`);
    }

    return checklists;
  } catch (error) {
    throw error;
  }
};
