import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
    employeeId: {
        type: Number,
        unique: true,
    },
    name: String,
    dob: Date,
    gender: String,
    subject: String,
    joiningDate: {
        type: Date,
        default: Date.now,
    },
    contact: {
        phone: Number,
        email: String
    },
    address: {
        line: String,
        city: String,
        state: String,
        pincode: Number
    },
    password: {
        type: String,
        required: true
    },
    passwordChanged: {
        type: Boolean,
        default: false
    }
});

const teachersModal = mongoose.model("teachers", teacherSchema);
export default teachersModal;