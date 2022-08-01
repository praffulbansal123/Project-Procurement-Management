import mongoose from "mongoose";
const {Schema, model, Types} = mongoose

const ObjectId = Schema.Types.ObjectId;

const orderSchema = new Schema({
    clientId: {type : ObjectId, ref : "User"},
    createdBy : {type : ObjectId, ref : "User"},
    status : {type : String},
    blankChecklistId : {type : ObjectId, ref : "BlankChecklist"},
    filledChecklistId : {type : ObjectId, ref : "FilledChecklist"},
    items : {type : Number},
    itemType : {type : String},
    itemDetails : {type : String},
    coolerRequired : {type : Boolean},
    paddingRequired : {type : Boolean},
    waterProtectionRequired : {type : Boolean},
    palletsRequired : {type : Boolean},
    sharingAllowed : {type : Boolean},
    deliveryTo : {type : String},
    pickUpFrom : {type : String},
    isVerified : {type : Boolean}

}, {timestamps : true})


 const Order = model("Order", orderSchema);

 export default Order;