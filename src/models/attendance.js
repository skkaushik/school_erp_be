import mongoose from "mongoose";

const attendanceRecordSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "students",
        required: true
    },
    status: {
        type: String,
        enum: ["Present", "Absent", "Leave", "Half-day"],
        required: true
    },
    remarks: {
        type: String
    }
}, { _id: false });

const attendanceSchema = new mongoose.Schema({
    classNo: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    records: [attendanceRecordSchema]
}, { timestamps: true });

// Ensure we don't have multiple attendance documents for the same class on the same day
attendanceSchema.index({ classNo: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
