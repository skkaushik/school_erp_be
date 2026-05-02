import { Router } from "express";
import { markAttendance, getAttendanceByClassAndDate, getStudentAttendanceHistory } from "../controllers/attendance.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = Router();

router.use(authMiddleware);
router.use(authorizeRoles("admin", "teacher"));

router.post("/mark", markAttendance);
router.get("/class", getAttendanceByClassAndDate);
router.get("/student/:studentId", getStudentAttendanceHistory);

export default router;
