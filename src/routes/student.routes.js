import { Router } from "express";
import { createstudent, getAllStudents, getStudentById, updateStudent, deleteStudent } from "../controllers/student.controller.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = Router();

router.post("/create", authorizeRoles("admin", "teacher"), createstudent);
router.get('/', authorizeRoles("admin", "teacher"), getAllStudents);
router.get('/:id', authorizeRoles("admin", "teacher"), getStudentById);
router.put('/:id', authorizeRoles("admin", "teacher"), updateStudent);
router.delete('/:id', authorizeRoles("admin", "teacher"), deleteStudent);

export default router;