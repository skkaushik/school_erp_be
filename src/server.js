import express from 'express';
import { PORT } from './constants/app.constants.js';
import connectDB from './config/db.js';
import dotenv from "dotenv";
import studentRoutes from "./routes/student.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import financeRoutes from "./routes/finance.routes.js";
import examRoutes from "./routes/exam.routes.js";
import classRoutes from "./routes/class.routes.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'School ERP Backend is running.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

connectDB();

app.use("/api/students", authMiddleware, studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/exam", examRoutes);
app.use("/api/class", classRoutes);

// Global Error Handler should be the last middleware
app.use(errorHandler);
