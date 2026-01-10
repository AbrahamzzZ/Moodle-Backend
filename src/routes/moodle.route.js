import { Router } from "express";
import { listCourses } from "../controllers/moodle.controller.js";

const router = Router();

router.get("/courses/:userId", listCourses);

export default router;
