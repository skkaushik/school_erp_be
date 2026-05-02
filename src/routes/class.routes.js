import { Router } from "express";
import { createClass, updateClassTeacher, getAllClasses, assignSubject, getSubjectsByClass } from "../controllers/class.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", authorizeRoles("admin", "teacher"), getAllClasses);
router.post("/create", authorizeRoles("admin"), createClass);
router.put("/update-teacher", authorizeRoles("admin"), updateClassTeacher);

router.post("/subject/assign", authorizeRoles("admin"), assignSubject);
router.get("/subject/:classNo", authorizeRoles("admin", "teacher"), getSubjectsByClass);

export default router;
