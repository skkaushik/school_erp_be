import studentsModal from "../models/students.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createstudent = asyncHandler(async (req, res) => {
    const result = await studentsModal.create(req.body);
    return res.status(201).json(new ApiResponse(201, result, "Student created successfully"));
});

export const getAllStudents = asyncHandler(async (req, res) => {
    const students = await studentsModal.find();
    return res.status(200).json(new ApiResponse(200, students, "Student data fetched successfully"));
});

export const getStudentById = asyncHandler(async (req, res) => {
    const student = await studentsModal.findById(req.params.id);
    if (!student) {
        throw new ApiError(404, "Student not found");
    }
    return res.status(200).json(new ApiResponse(200, student, "Student details fetched successfully"));
});

export const updateStudent = asyncHandler(async (req, res) => {
    const updatedStudent = await studentsModal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStudent) {
        throw new ApiError(404, "Student not found");
    }
    return res.status(200).json(new ApiResponse(200, updatedStudent, "Student updated successfully"));
});

export const deleteStudent = asyncHandler(async (req, res) => {
    const deletedStudent = await studentsModal.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
        throw new ApiError(404, "Student not found");
    }
    return res.status(200).json(new ApiResponse(200, deletedStudent, "Student deleted successfully"));
});