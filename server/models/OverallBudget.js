import mongoose from "mongoose";

const overallBudgetSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    overallBudget: {type: Number, required: true},
}, {timestamps: true});

const OverallBudget = mongoose.model("OverallBudget", overallBudgetSchema);

export default OverallBudget;