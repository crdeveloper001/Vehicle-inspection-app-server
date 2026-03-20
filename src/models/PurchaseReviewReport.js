import mongoose from "mongoose";

const PurchaseReviewReport = new mongoose.Schema({
  marca: String,
  modelo: String,
  anio: Number,
  placa: String,
  vin: String,
  kilometraje: String,

  motor_estado: String,
  motor_obs: String,

  frenos_estado: String,
  frenos_obs: String,

  suspension_estado: String,
  suspension_obs: String,

  carroceria: String,
  interior: String,
  llantas: String,

  conclusion: String,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });

export default mongoose.model("PurchaseReviewReport", PurchaseReviewReport);