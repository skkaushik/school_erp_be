import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    classNo: {
        type: Number,
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "teachers",
        required: true
    }
}, { timestamps: true });

// A class can only have one specific subject assigned to one teacher
subjectSchema.index({ name: 1, classNo: 1 }, { unique: true });

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;
