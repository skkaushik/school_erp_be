import mongoose from "mongoose";

const feeSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "students",
        required: true
    },
    month: {
        type: String,
        required: true, // e.g., "January"
    },
    year: {
        type: Number,
        required: true, // e.g., 2026
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["Paid", "Pending", "Partial"],
        default: "Pending"
    }
}, { timestamps: true });

// A student can only have one fee record per month/year
feeSchema.index({ student: 1, month: 1, year: 1 }, { unique: true });

const Fee = mongoose.model("Fee", feeSchema);

export default Fee;
