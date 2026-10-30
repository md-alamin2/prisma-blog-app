import { Router } from "express";
import verifyRole, { UserRole } from "../../middleware/verifyRole";
import { commentController } from "./comment.controller";

const router = Router();

router.get("/:commentId", commentController.getCommentById);

router.get("/author/:authorId", commentController.getCommentByAuthorId);

router.post(
  "/",
  verifyRole(UserRole.USER, UserRole.ADMIN),
  commentController.createComment,
);

router.patch(
  "/:commentId",
  verifyRole(UserRole.USER, UserRole.ADMIN),
  commentController.updateComment,
);

router.delete(
  "/:commentId",
  verifyRole(UserRole.USER, UserRole.ADMIN),
  commentController.deleteComment,
);

router.patch(
  "/moderate/:commentId",
  verifyRole(UserRole.ADMIN),
  commentController.moderateComment,
);

export const commentRouter = router;
