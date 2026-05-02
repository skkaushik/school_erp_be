import Class from "../models/class.js";
import Subject from "../models/subject.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// --- CLASS ---
export const createClass = asyncHandler(async (req, res) => {
    const { classNo, classTeacherId } = req.body;
    
    if (!classNo || !classTeacherId) {
        throw new ApiError(400, "classNo and classTeacherId are required.");
    }

    let existingClass = await Class.findOne({ classNo });
    if (existingClass) {
        throw new ApiError(400, "Class already exists. Use update instead.");
    }

    const newClass = await Class.create({
        classNo,
        classTeacher: classTeacherId
    });
    return res.status(201).json(new ApiResponse(201, newClass, "Class created successfully."));
});

export const updateClassTeacher = asyncHandler(async (req, res) => {
    const { classNo, classTeacherId } = req.body;
    
    if (!classNo || !classTeacherId) {
        throw new ApiError(400, "classNo and classTeacherId are required.");
    }

    const updatedClass = await Class.findOneAndUpdate(
        { classNo },
        { classTeacher: classTeacherId },
        { new: true }
    );

    if (!updatedClass) {
        throw new ApiError(404, "Class not found.");
    }
    return res.status(200).json(new ApiResponse(200, updatedClass, "Class teacher updated successfully."));
});

export const getAllClasses = asyncHandler(async (req, res) => {
    const classes = await Class.find().populate("classTeacher", "name employeeId");
    return res.status(200).json(new ApiResponse(200, classes, "Classes fetched successfully."));
});

// --- SUBJECT ---
export const assignSubject = asyncHandler(async (req, res) => {
    const { name, classNo, teacherId } = req.body;
    
    if (!name || !classNo || !teacherId) {
        throw new ApiError(400, "name, classNo, and teacherId are required.");
    }

    let existingSubject = await Subject.findOne({ name, classNo });

    let subject;
    if (existingSubject) {
        existingSubject.teacher = teacherId;
        await existingSubject.save();
        subject = existingSubject;
    } else {
        subject = await Subject.create({
            name,
            classNo,
            teacher: teacherId
        });
    }

    return res.status(200).json(new ApiResponse(200, subject, "Subject assigned to teacher successfully."));
});

export const getSubjectsByClass = asyncHandler(async (req, res) => {
    const { classNo } = req.params;
    
    if (!classNo) {
        throw new ApiError(400, "classNo is required.");
    }

    const subjects = await Subject.find({ classNo: Number(classNo) }).populate("teacher", "name employeeId");
    return res.status(200).json(new ApiResponse(200, subjects, "Subjects fetched."));
});

export const getSubjectsByTeacher = asyncHandler(async (req, res) => {
    const { teacherId } = req.params;
    if (!teacherId) {
        throw new ApiError(400, "teacherId is required.");
    }
    const subjects = await Subject.find({ teacher: teacherId });
    return res.status(200).json(new ApiResponse(200, subjects, "Subjects fetched."));
});
