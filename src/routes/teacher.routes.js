import { Router } from "express";
import { createTeacher, getAllTeachers, getTeacherById, updateTeacher, deleteTeacher, loginTeacher, changeTeacherPassword } from "../controllers/teacher.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/create", authMiddleware, createTeacher);
router.post("/login", loginTeacher);
router.post("/change-password", authMiddleware, changeTeacherPassword);
router.get('/', authMiddleware, getAllTeachers);
router.get('/:id', authMiddleware, getTeacherById);
router.put('/:id', authMiddleware, updateTeacher);
router.delete('/:id', authMiddleware, deleteTeacher);

export default router;