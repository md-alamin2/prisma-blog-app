import { Router } from "express";
import { postController } from "./post.controller";
import verifyRole, { UserRole } from "../../middleware/verifyRole";

const router = Router();

router.get("/", postController.getAllPost);

router.get("/:postId", postController.getSinglePost);

router.post(
  "/",
  verifyRole(UserRole.USER, UserRole.ADMIN),
  postController.createPost,
);

export const postRouter = router;
