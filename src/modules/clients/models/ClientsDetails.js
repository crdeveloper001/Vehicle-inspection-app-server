import mongoose from "mongoose";
import PurchaseReviewReport from "../Inspections/PurchaseReviewReport.js";
import ClientsVehiclesDetails from "../clientsSchema/ClientsVehiclesDetails.js";

const ClientsDetailsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  whatsappNumberLink: {
    type: String,
    trim: true,
  },
  IsRegistered: {
    type: Boolean,
    default: false,
  },
  VehiclesDetails: {
    type: [ClientsVehiclesDetails.schema],

    default: [],
  },
  CurrentReports: {
    type: [PurchaseReviewReport.schema],
    default: [],
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  hasAccount: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model('ClientsDetails', ClientsDetailsSchema);
