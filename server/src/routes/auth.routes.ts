import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { signupSchema, providerSignupSchema, loginSchema, refreshSchema } from "../validators/auth.validator";

const router = Router();

router.post("/signup", validate(signupSchema), authController.signup);
router.post("/provider/signup", validate(providerSignupSchema), authController.providerSignup);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", validate(refreshSchema), authController.refresh);
router.get("/me", authenticate, authController.getMe);

export default router;
