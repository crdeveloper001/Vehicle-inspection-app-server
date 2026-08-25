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
  IsProfileNew: {
    type: Boolean,
    default: true,
  },
  IsPasswordChanged: {
    type: Boolean,
    default: false,
  },

}, {
  timestamps: true
});

export default mongoose.model("User", UserSchema);