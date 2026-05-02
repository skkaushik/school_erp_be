import Salary from "../models/salary.js";
import Fee from "../models/fee.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// --- SALARY ---
export const paySalary = asyncHandler(async (req, res) => {
    const { teacherId, month, year, amount } = req.body;
    
    if (!teacherId || !month || !year || !amount) {
        throw new ApiError(400, "Missing required fields: teacherId, month, year, amount.");
    }

    let salaryRecord = await Salary.findOne({ teacher: teacherId, month, year });

    if (salaryRecord) {
        if (salaryRecord.status === "Paid") {
            throw new ApiError(400, "Salary already paid for this month.");
        }
        salaryRecord.status = "Paid";
        salaryRecord.amount = amount;
        await salaryRecord.save();
    } else {
        salaryRecord = await Salary.create({
            teacher: teacherId,
            month,
            year,
            amount,
            status: "Paid"
        });
    }

    return res.status(200).json(new ApiResponse(200, salaryRecord, "Teacher salary processed successfully."));
});

export const getSalaryHistory = asyncHandler(async (req, res) => {
    const { teacherId } = req.params;
    const history = await Salary.find({ teacher: teacherId }).sort({ year: -1, month: -1 });
    return res.status(200).json(new ApiResponse(200, history, "Salary history fetched."));
});

// --- FEES ---
export const collectFee = asyncHandler(async (req, res) => {
    const { studentId, month, year, amount } = req.body;
    
    if (!studentId || !month || !year || !amount) {
        throw new ApiError(400, "Missing required fields: studentId, month, year, amount.");
    }

    let feeRecord = await Fee.findOne({ student: studentId, month, year });

    if (feeRecord) {
        if (feeRecord.status === "Paid") {
            throw new ApiError(400, "Fee already fully paid for this month.");
        }
        feeRecord.status = "Paid";
        feeRecord.amount = amount;
        await feeRecord.save();
    } else {
        feeRecord = await Fee.create({
            student: studentId,
            month,
            year,
            amount,
            status: "Paid"
        });
    }

    return res.status(200).json(new ApiResponse(200, feeRecord, "Student fee collected successfully."));
});

export const getFeeHistory = asyncHandler(async (req, res) => {
    const { studentId } = req.params;
    const history = await Fee.find({ student: studentId }).sort({ year: -1, month: -1 });
    return res.status(200).json(new ApiResponse(200, history, "Fee history fetched."));
});
