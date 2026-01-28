import { Router } from "express";
import { getCourseDetailController, listCourses } from "../controllers/course.controller.js";
import authMiddleware from "../middleware/auth.middleware.js"

const router = Router();

router.get("/courses", authMiddleware, listCourses);
router.get("/courses/:id", authMiddleware, getCourseDetailController);

export default router;
