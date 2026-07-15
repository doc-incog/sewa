import { Router } from "express";
import * as searchController from "../controllers/search.controller";

const router = Router();

router.get("/providers", searchController.searchProviders);
router.get("/services", searchController.searchServices);

export default router;
