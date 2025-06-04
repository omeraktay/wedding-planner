import mongoose from 'mongoose';

const seatingChartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  tableCount: { type: Number, required: true },
  seatsPerTable: { type: Number, required: true },
  createdBy: { type: String },
  assignments: {
    type: Map,
    of: new mongoose.Schema({
      table: Number,
      seat: Number
    }),
    default: {},
  },
}, { timestamps: true });

const SeatingChart = mongoose.model("SeatingChart", seatingChartSchema);

export default SeatingChart;