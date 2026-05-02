import Attendance from "../models/attendance.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const markAttendance = asyncHandler(async (req, res) => {
    const { classNo, date, records } = req.body;
    
    if (!classNo || !date || !records || !Array.isArray(records)) {
        throw new ApiError(400, "classNo, date, and records array are required.");
    }

    const dateObj = new Date(date);
    dateObj.setUTCHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({ classNo, date: dateObj });

    if (attendance) {
        attendance.records = records;
        await attendance.save();
    } else {
        attendance = await Attendance.create({ classNo, date: dateObj, records });
    }
    
    return res.status(200).json(new ApiResponse(200, attendance, "Attendance marked successfully."));
});

export const getAttendanceByClassAndDate = asyncHandler(async (req, res) => {
    const { classNo, date } = req.query;

    if (!classNo || !date) {
        throw new ApiError(400, "classNo and date query parameters are required.");
    }

    const dateObj = new Date(date);
    dateObj.setUTCHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({ classNo: Number(classNo), date: dateObj }).populate("records.student", "name admissionNo");

    if (!attendance) {
        throw new ApiError(404, "No attendance record found for this class on this date.");
    }
    
    return res.status(200).json(new ApiResponse(200, attendance, "Attendance fetched successfully."));
});

export const getStudentAttendanceHistory = asyncHandler(async (req, res) => {
    const { studentId } = req.params;

    if (!studentId) {
        throw new ApiError(400, "Student ID is required.");
    }

    const attendanceDocs = await Attendance.find({
        "records.student": studentId
    }).sort({ date: -1 });

    const history = attendanceDocs.map(doc => {
        const studentRecord = doc.records.find(r => r.student.toString() === studentId.toString());
        return {
            date: doc.date,
            classNo: doc.classNo,
            status: studentRecord ? studentRecord.status : "Unknown",
            remarks: studentRecord ? studentRecord.remarks : ""
        };
    });
    
    return res.status(200).json(new ApiResponse(200, history, "Student attendance history fetched successfully."));
});
