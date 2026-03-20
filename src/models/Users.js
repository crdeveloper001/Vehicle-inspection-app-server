import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  lastName:String,
  phone:{
    type: Number,
    length: 8,
  },
  userType:String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
}, {
  timestamps: true
});

export default mongoose.model("User", UserSchema);