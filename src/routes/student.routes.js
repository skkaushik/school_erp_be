import { Router } from "express";
import { createstudent, getAllStudents, getStudentById, updateStudent, deleteStudent } from "../controllers/student.controller.js";

const router = Router();

router.post("/create", createstudent);
router.get('/', getAllStudents)
router.get('/:id', getStudentById)
router.put('/:id', updateStudent)
router.delete('/:id', deleteStudent)

export default router;