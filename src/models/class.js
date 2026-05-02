import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    classNo: {
        type: Number,
        required: true,
        unique: true
    },
    classTeacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "teachers",
        required: true
    }
}, { timestamps: true });

const Class = mongoose.model("Class", classSchema);

export default Class;
