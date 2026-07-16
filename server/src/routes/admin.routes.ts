import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.use(authenticate);
router.use(authorize("admin"));

router.get("/dashboard", adminController.getDashboardStats);
router.get("/users", adminController.getAllUsers);
router.delete("/users/:id", adminController.banUser);
router.get("/providers", adminController.getAllProviders);
router.put("/providers/:id/verify", adminController.verifyProvider);
router.get("/bookings", adminController.getAllBookings);
router.get("/services", adminController.getAllServices);
router.post("/services", adminController.createService);
router.put("/services/:id", adminController.updateService);
router.delete("/services/:id", adminController.deleteService);

export default router;
