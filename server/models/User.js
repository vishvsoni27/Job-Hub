import { requestDataIntegration } from "@sentry/node";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    _id:{type: String,required: true},
    name:{type: String,required: true},
    email:{type: String,required: true},
    resume:{type: String},
    image:{type: String,required: true},
});

const User = mongoose.model("User",UserSchema);

export default User;