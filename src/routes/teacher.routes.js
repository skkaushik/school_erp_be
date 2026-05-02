import { Router } from "express";
import { createTeacher, getAllTeachers, getTeacherById, updateTeacher, deleteTeacher, loginTeacher, changeTeacherPassword } from "../controllers/teacher.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = Router();

router.post("/create", authMiddleware, authorizeRoles("admin"), createTeacher);
router.post("/login", loginTeacher);
router.post("/change-password", authMiddleware, authorizeRoles("teacher"), changeTeacherPassword);
router.get('/', authMiddleware, authorizeRoles("admin", "teacher"), getAllTeachers);
router.get('/:id', authMiddleware, authorizeRoles("admin", "teacher"), getTeacherById);
router.put('/:id', authMiddleware, authorizeRoles("admin"), updateTeacher);
router.delete('/:id', authMiddleware, authorizeRoles("admin"), deleteTeacher);

export default router;