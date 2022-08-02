import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;
const ObjectId = Schema.Types.ObjectId;

/*
* @author Prafful Bansal
* @description FilledChecklist schema and model
*/
const filledChecklistSchema = new Schema({
    orderId: { type: ObjectId, ref: "Order" },
    inspectedBy: { type: ObjectId, ref: "User" },
    requirements: {
      cooler: { type: Boolean },
      padding: { type: Boolean },
      compartment: { type: Boolean },
      pallets: { type: Boolean },
      waterProtection: { type: Boolean },
    },
    category: { type: String },
    driverDetails: {
      licensePresent: { type: Boolean },
      rc: { type: Boolean },
      phone: { type: Boolean },
      airPressureGood: { type: Boolean },
    },
    halfLoadingImage: { type: String },
    fullLoadingImage: { type: String },
    summary: { type: String },
  }, { timestamps: true });

// Creating Model
const filledChecklist = model("FilledChecklist", filledChecklistSchema);

export default filledChecklist;
