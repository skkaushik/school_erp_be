import mongoose from "mongoose";

const salarySchema = new mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "teachers",
        required: true
    },
    month: {
        type: String,
        required: true, // e.g., "January", "February"
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
        enum: ["Paid", "Pending"],
        default: "Pending"
    }
}, { timestamps: true });

// A teacher can only have one salary record per month/year
salarySchema.index({ teacher: 1, month: 1, year: 1 }, { unique: true });

const Salary = mongoose.model("Salary", salarySchema);

export default Salary;
