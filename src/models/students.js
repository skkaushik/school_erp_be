import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    admissionNo: {
        type: Number,
        unique: true,
    },
    name: String,
    dob: Date,
    gender: String,
    classNo: Number,

    admissionDate: {
        type: Date,
        default: Date.now,
    },
    parent: {
        fatherName: String,
        motherName: String,
        phone: Number
    },
    address: {
        line: String,
        city: String,
        state: String,
        pincode: Number
    }
})

const studentsModal = mongoose.model("students", studentSchema);

export default studentsModal;