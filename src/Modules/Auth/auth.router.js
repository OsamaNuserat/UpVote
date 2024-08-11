import { Router } from "express";
import * as authController from "./Controller/auth.controller.js";
import validation from "../../Middleware/validation.js";
import * as validators from "./auth.validation.js";
import { asyncHandler } from "../../Services/ErrorHandling.js";
const router = Router();

router.post("/signup",validation(validators.signupSchema),asyncHandler(authController.signup));
router.get("/confirm-email/:token", asyncHandler(authController.confirmEmail));
router.post("/signin",validation(validators.loginSchema),asyncHandler(authController.signin));
export default router;
