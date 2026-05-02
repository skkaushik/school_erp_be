import { Admin } from "../models/admin.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const registerAdmin = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
        throw new ApiError(400, "Admin already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = await Admin.create({
        name,
        email,
        password: hashedPassword
    });

    const adminResponse = { id: admin._id, name: admin.name, email: admin.email };

    return res.status(201).json(new ApiResponse(201, { admin: adminResponse }, "Admin created successfully"));
});

export const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
        throw new ApiError(404, "Admin not found");
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        throw new ApiError(400, "Invalid credentials");
    }

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET || "secret", { expiresIn: "1d" });

    const adminResponse = { id: admin._id, name: admin.name, email: admin.email };

    return res.status(200).json(new ApiResponse(200, { token, admin: adminResponse }, "Login successful"));
});
