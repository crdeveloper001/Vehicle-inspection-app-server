import mongoose from "mongoose";

const diagnosticAndQuoteSchema = new mongoose.Schema(
  {
    ClientDetails: [{
      type: mongoose.Schema.Types.Mixed,
      default: {},
    }],

    VehicleDetails: [{
      type: mongoose.Schema.Types.Mixed,
      default: {},
    }],

    DiagnosticName: [
      {
        type: String,
        trim: true,
        required: true,
      },
    ],
    DiagnosticTechinician: {
      type: String,
      trim: true,
      default: "",
    },
    DiagnosticComments: [
      {
        type: String,
        trim: true,
        default: "",
      },
    ],
    DiagnosticSpares: [
      {
        type: String,
        trim: true,
        default: "",
      },
    ],
    DiagnosticTotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    DiagnosticCreationDate: {
      type: Date,
      default: Date.now,
    },
    DiagnosticValid: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('DiagnosticAndQuote', diagnosticAndQuoteSchema);
