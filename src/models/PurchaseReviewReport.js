import mongoose from "mongoose";

const purchaseReviewReportSchema = new mongoose.Schema(
  {
    // Vehicle Information
    marca: String,
    modelo: String,
    anio: Number,
    placa: String,
    vin: String,
    kilometraje: String,

    // Motor
    motor_estado: String,
    motor_obs: String,

    // Brakes
    frenos_estado: String,
    frenos_obs: String,

    // Suspension
    suspension_estado: String,
    suspension_obs: String,

    // Other Components
    carroceria: String,
    interior: String,
    llantas: String,

    // Report
    conclusion: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export default mongoose.model("PurchaseReviewReport", purchaseReviewReportSchema);