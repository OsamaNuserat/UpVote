import { Router } from "express";
import * as postController from "./Controller/post.controller.js";
import { asyncHandler } from "../../Services/ErrorHandling.js";
import auth from "../../Middleware/auth.js";
import fileupload from "../../Services/Multer.js";
const router = Router();

router.get("/", asyncHandler(postController.getAllPost));
router.post(
  "/create",
  auth,
  fileupload().single("image"),
  asyncHandler(postController.createPost)
);

router.patch("/like/:id", auth, asyncHandler(postController.likePost));
router.patch("/unlike/:id", auth, asyncHandler(postController.unLikePost));

// comment section

router.post(
  "/comment/:id",
  auth,
  fileupload().single("image"),
  asyncHandler(postController.createComment)
);

export default router;
