import studentsModal from "../models/students.js";

export const createstudent = async (req, res) => {
    const { body } = req;

    try {
        const result = await studentsModal.create(body);
        res.status(201).json({
            success: true,
            message: "Student created successfully",
            data: result
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export const getAllStudents = async (req, res) => {
    try {
        const students = await studentsModal.find();

        res.status(200).json({
            success: true,
            message: 'Student data fetched successfully',
            data: students
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getStudentById = async (req, res) => {
    try {
        const student = await studentsModal.findById(req.params.id);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Student details fetched successfully',
            data: student
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const updateStudent = async (req, res) => {
    try {
        const updatedStudent = await studentsModal.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedStudent) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Student updated successfully',
            data: updatedStudent
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const deleteStudent = async (req, res) => {
    try {
        const deletedStudent = await studentsModal.findByIdAndDelete(req.params.id);
        if (!deletedStudent) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Student deleted successfully',
            data: deletedStudent
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}