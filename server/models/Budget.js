import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    overAllBudget: {type: Number},
    name: {type: String, required: true},
    category: {type: String},
    estimatedCost: {type: Number, required: true},
    actualCost: {type: Number, default: 0},
    status: {type: String, enum: ['Pending', "Paid"], default: 'Pending'}
}, {timestamps: true});

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;