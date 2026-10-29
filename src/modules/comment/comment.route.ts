import { Router } from "express";
import verifyRole, { UserRole } from "../../middleware/verifyRole";
import { commentController } from "./comment.controller";

const router = Router();

router.get("/:commentId", commentController.getCommentById);

router.post(
  "/",
  verifyRole(UserRole.USER, UserRole.ADMIN),
  commentController.createComment,
);

export const commentRouter = router;
