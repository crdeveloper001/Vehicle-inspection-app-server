import mongoose from "mongoose";

const clientsVehiclesDetailsSchema = new mongoose.Schema(
    {
       
        VehicleName: {
            type: String,
            required: true,
        },
        VehicleYear: {
            type: Number,
            required: true,
        },
        VehicleModel: {
            type: String,
            required: true,
        },
        VehicleEngineCC: {
            type: Number,
            required: true,
        },
        VehiclePlate: {
            type: String,
            required: true,
        },
        VehicleVInNumber: {
            type: String,
            required: true,
        },
        VehicleDiagnostics: {
            type: Array,
            default: [],
        },
        VehicleActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);
export default mongoose.model("ClientsVehiclesDetails", clientsVehiclesDetailsSchema);
