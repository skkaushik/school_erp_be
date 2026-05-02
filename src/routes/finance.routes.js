import { Router } from "express";
import { paySalary, getSalaryHistory, collectFee, getFeeHistory } from "../controllers/finance.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = Router();

router.use(authMiddleware);
router.use(authorizeRoles("admin"));

router.post("/salary/pay", paySalary);
router.get("/salary/history/:teacherId", getSalaryHistory);

router.post("/fee/collect", collectFee);
router.get("/fee/history/:studentId", getFeeHistory);

export default router;
