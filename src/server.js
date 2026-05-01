import express from 'express';
import { PORT } from './constants/app.constants.js';
import connectDB from './config/db.js';
import dotenv from "dotenv";
import studentRoutes from "./routes/student.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { authMiddleware } from "./middleware/auth.middleware.js";

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
