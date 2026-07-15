import { Router } from "express";
import * as providerController from "../controllers/provider.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", providerController.getAllProviders);
router.get("/service/:serviceId", providerController.getProvidersByService);
router.get("/:id", providerController.getProviderById);
router.put("/profile", authenticate, providerController.updateProviderProfile);

export default router;
