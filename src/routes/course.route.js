import { Router } from "express";
import { listCourses } from "../controllers/course.controller.js";
import authMiddleware from "../middleware/auth.middleware.js"

const router = Router();

router.get("/courses", authMiddleware, listCourses);

export default router;
