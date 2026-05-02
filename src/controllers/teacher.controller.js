import teachersModal from "../models/teachers.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createTeacher = asyncHandler(async (req, res) => {
    const rawPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const teacherData = { ...req.body, password: hashedPassword, passwordChanged: false };
    const result = await teachersModal.create(teacherData);

    return res.status(201).json(new ApiResponse(201, { data: result, dummyPassword: rawPassword }, "Teacher onboarded successfully"));
});

export const getAllTeachers = asyncHandler(async (req, res) => {
    const result = await teachersModal.find();
    return res.status(200).json(new ApiResponse(200, result, "Teacher data fetched successfully"));
});

export const getTeacherById = asyncHandler(async (req, res) => {
    const teacher = await teachersModal.findById(req.params.id);
    if (!teacher) {
        throw new ApiError(404, "Teacher not found");
    }
    return res.status(200).json(new ApiResponse(200, teacher, "Teacher details fetched successfully"));
});

export const updateTeacher = asyncHandler(async (req, res) => {
    const updatedTeacher = await teachersModal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTeacher) {
        throw new ApiError(404, "Teacher not found");
    }
    return res.status(200).json(new ApiResponse(200, updatedTeacher, "Teacher updated successfully"));
});

export const deleteTeacher = asyncHandler(async (req, res) => {
    const deletedTeacher = await teachersModal.findByIdAndDelete(req.params.id);
    if (!deletedTeacher) {
        throw new ApiError(404, "Teacher not found");
    }
    return res.status(200).json(new ApiResponse(200, deletedTeacher, "Teacher deleted successfully"));
});

export const loginTeacher = asyncHandler(async (req, res) => {
    const { employeeId, password } = req.body;

    const teacherObj = await teachersModal.findOne({ employeeId });
    if (!teacherObj) {
        throw new ApiError(404, "Teacher not found");
    }

    const isMatch = await bcrypt.compare(password, teacherObj.password);
    if (!isMatch) {
        throw new ApiError(400, "Invalid credentials");
    }

    const token = jwt.sign(
        { id: teacherObj._id, role: "teacher", passwordChanged: teacherObj.passwordChanged },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "1d" }
    );

    const requirePasswordChange = !teacherObj.passwordChanged;
    const teacher = { id: teacherObj._id, name: teacherObj.name, employeeId: teacherObj.employeeId };

    if (requirePasswordChange) {
        return res.status(200).json({
            success: true,
            message: "Please change your password to continue",
            requirePasswordChange: true,
            token
        });
    }

    return res.status(200).json(new ApiResponse(200, { token, teacher }, "Login successful"));
});

export const changeTeacherPassword = asyncHandler(async (req, res) => {
    const teacherId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    const teacher = await teachersModal.findById(teacherId);
    if (!teacher) {
        throw new ApiError(404, "Teacher not found");
    }

    const isMatch = await bcrypt.compare(oldPassword, teacher.password);
    if (!isMatch) {
        throw new ApiError(400, "Invalid old password");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    teacher.password = hashedNewPassword;
    teacher.passwordChanged = true;
    await teacher.save();

    return res.status(200).json(new ApiResponse(200, null, "Password changed successfully. You can now access the portal."));
});