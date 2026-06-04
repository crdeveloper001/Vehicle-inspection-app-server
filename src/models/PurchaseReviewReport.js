import mongoose from "mongoose";

const purchaseReviewReportSchema = new mongoose.Schema(
  {
    //Client Information
    clientName: String,
    clientLastname: String,
    clientPhone: String,

    // Vehicle Information
    make: String,
    model: String,
    year: Number,
    plate: String,
    vin: String,
    mileage: String,

    // Engine
    engineCondition: String,
    engineNotes: String,

    // Brakes
    brakeCondition: String,
    brakeNotes: String,

    // Suspension
    suspensionCondition: String,
    suspensionNotes: String,

    // Other Components
    body: String,
    interior: String,
    tires: String,

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