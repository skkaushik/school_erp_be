import mongoose from "mongoose";

const examMarkSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "students",
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    maxScore: {
        type: Number,
        required: true
    },
    remarks: {
        type: String
    }
}, { _id: false });

const examSchema = new mongoose.Schema({
    classNo: {
        type: Number,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    examName: {
        type: String,
        required: true // e.g., "Midterms", "Finals", "Unit Test 1"
    },
    date: {
        type: Date,
        required: true
    },
    marks: [examMarkSchema]
}, { timestamps: true });

// Prevent duplicate exam records for the same class, subject, and exam name
examSchema.index({ classNo: 1, subject: 1, examName: 1 }, { unique: true });

const Exam = mongoose.model("Exam", examSchema);

export default Exam;
