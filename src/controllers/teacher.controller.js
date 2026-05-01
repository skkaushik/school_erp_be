import teachersModal from "../models/teachers.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const createTeacher = async (req, res) => {
    const { body } = req;
    try {
        const rawPassword = Math.random().toString(36).slice(-8); // Generate an 8-character dummy password
        const hashedPassword = await bcrypt.hash(rawPassword, 10);
        
        const teacherData = { ...body, password: hashedPassword, passwordChanged: false };
        const result = await teachersModal.create(teacherData);
        
        res.status(201).json({
            success: true,
            message: "Teacher onboarded successfully",
            data: result,
            dummyPassword: rawPassword // Returning the generated password so the admin can share it
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllTeachers = async (req, res) => {
    try {
        const result = await teachersModal.find();
        res.status(200).json({
            success: true,
            message: 'Teacher data fetched successfully',
            data: result
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getTeacherById = async (req, res) => {
    try {
        const teacher = await teachersModal.findById(req.params.id);
        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Teacher details fetched successfully',
            data: teacher
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateTeacher = async (req, res) => {
    try {
        const updatedTeacher = await teachersModal.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedTeacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Teacher updated successfully',
            data: updatedTeacher
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteTeacher = async (req, res) => {
    try {
        const deletedTeacher = await teachersModal.findByIdAndDelete(req.params.id);
        if (!deletedTeacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Teacher deleted successfully',
            data: deletedTeacher
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const loginTeacher = async (req, res) => {
    try {
        const { employeeId, password } = req.body;
        
        const teacher = await teachersModal.findOne({ employeeId });
        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }

        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: teacher._id, role: "teacher", passwordChanged: teacher.passwordChanged }, 
            process.env.JWT_SECRET || "secret", 
            { expiresIn: "1d" }
        );

        if (!teacher.passwordChanged) {
            return res.status(200).json({
                success: true,
                message: "Please change your password to continue",
                requirePasswordChange: true,
                token
            });
        }

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            data: { id: teacher._id, name: teacher.name, employeeId: teacher.employeeId }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const changeTeacherPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const teacherId = req.user.id; // From auth middleware

        const teacher = await teachersModal.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, teacher.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid old password" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        
        teacher.password = hashedNewPassword;
        teacher.passwordChanged = true;
        await teacher.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully. You can now access the portal."
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};