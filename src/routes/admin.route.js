import { Router } from "express";
import { getAdmin } from "../controllers/admin.controller.js";

const router = Router();

router.get("/get-admin", getAdmin);

export default router;
