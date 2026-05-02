import { Router } from "express";
import { markExam, getExamByClassAndSubject, getStudentExamHistory } from "../controllers/exam.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = Router();

router.use(authMiddleware);

router.use(authorizeRoles("admin", "teacher"));

router.post("/mark", markExam);
router.get("/class", getExamByClassAndSubject);
router.get("/student/:studentId", getStudentExamHistory);

export default router;
