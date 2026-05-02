import Exam from "../models/exam.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const markExam = asyncHandler(async (req, res) => {
    const { classNo, subject, examName, date, marks } = req.body;
    
    if (!classNo || !subject || !examName || !date || !marks || !Array.isArray(marks)) {
        throw new ApiError(400, "Missing required fields: classNo, subject, examName, date, marks (array).");
    }

    let exam = await Exam.findOne({ classNo, subject, examName });

    if (exam) {
        exam.marks = marks;
        exam.date = date;
        await exam.save();
    } else {
        exam = await Exam.create({
            classNo,
            subject,
            examName,
            date,
            marks
        });
    }
    
    return res.status(200).json(new ApiResponse(200, exam, "Exam marks recorded successfully."));
});

export const getExamByClassAndSubject = asyncHandler(async (req, res) => {
    const { classNo, subject } = req.query;

    if (!classNo || !subject) {
        throw new ApiError(400, "classNo and subject query parameters are required.");
    }

    const exams = await Exam.find({ classNo: Number(classNo), subject }).populate("marks.student", "name admissionNo");

    if (!exams || exams.length === 0) {
        throw new ApiError(404, "No exam records found for this class and subject.");
    }
    
    return res.status(200).json(new ApiResponse(200, exams, "Exam records fetched successfully."));
});

export const getStudentExamHistory = asyncHandler(async (req, res) => {
    const { studentId } = req.params;

    if (!studentId) {
        throw new ApiError(400, "Student ID is required.");
    }

    const exams = await Exam.find({
        "marks.student": studentId
    }).sort({ date: -1 });

    const history = exams.map(exam => {
        const studentMark = exam.marks.find(m => m.student.toString() === studentId.toString());
        return {
            classNo: exam.classNo,
            subject: exam.subject,
            examName: exam.examName,
            date: exam.date,
            score: studentMark ? studentMark.score : 0,
            maxScore: studentMark ? studentMark.maxScore : 0,
            remarks: studentMark ? studentMark.remarks : ""
        };
    });
    
    return res.status(200).json(new ApiResponse(200, history, "Student exam history fetched successfully."));
});
