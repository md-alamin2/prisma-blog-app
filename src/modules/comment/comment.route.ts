import { Router } from "express";
import verifyRole, { UserRole } from "../../middleware/verifyRole";
import { commentController } from "./comment.controller";

const router = Router();

router.post(
  "/",
  verifyRole(UserRole.USER, UserRole.ADMIN),
  commentController.createPost,
);

export const commentRouter = router;
