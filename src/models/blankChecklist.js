import mongoose from "mongoose";

/*
* @author Prafful Bansal
* @description BlankChecklist schema and model
*/
const {Schema, model, Types } = mongoose
const ObjectId = Schema.Types.ObjectId;

const blankChecklistSchema = new Schema({
    clientId: {type : ObjectId, ref : "User"},
    createdBy : {type : ObjectId, ref : "User"},
    requirements : {
        cooler : {type : String},
        padding : {type : String},
        compartment : {type : String},
        pallets : {type : String},
        waterProtection : {type : String},
    },
    category : {type : String},
    driverDetails : {
        licensePresent : {type : String},
        rc : {type : String},
        phone : {type : String},
        airPressureGood : {type : String},
    },
    summary : {type : String}
}, {timestamps : true})

// Creating Model
const blankChecklist = model("BlankChecklist", blankChecklistSchema)

export default blankChecklist;