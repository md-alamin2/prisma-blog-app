import { Router } from "express";
import { postController } from "./post.controller";
import verifyRole, { UserRole } from "../../middleware/verifyRole";

const router = Router();

router.post(
  "/",
  verifyRole(UserRole.USER, UserRole.ADMIN),
  postController.createPost,
);

router.get("/", postController.getAllPost);

export const postRouter = router;
