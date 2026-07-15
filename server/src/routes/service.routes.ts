import { Router } from "express";
import * as serviceController from "../controllers/service.controller";

const router = Router();

router.get("/", serviceController.getAllServices);
router.get("/categories", serviceController.getCategories);
router.get("/:id", serviceController.getServiceById);

export default router;
