import mongoose from "mongoose";

const guestSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String},
    rsvp: {type: String, enum: ["Yes", "No", 'Maybe'], default: "Maybe"},
    createdBy: {type: String, required: true},
}, {timestamps: true});

const Guest = mongoose.model("Guest", guestSchema);

export default Guest;