import { Router } from "express";
import { postController } from "./post.controller";
import verifyRole, { UserRole } from "../../middleware/verifyRole";

const router = Router();

router.get(
  "/statistics",
  verifyRole(UserRole.ADMIN),
  postController.getStatistics,
);

router.get("/", postController.getAllPost);

router.get(
  "/my-post",
  verifyRole(UserRole.ADMIN, UserRole.USER),
  postController.getMyPost,
);

router.get("/:postId", postController.getSinglePost);

router.post(
  "/",
  verifyRole(UserRole.USER, UserRole.ADMIN),
  postController.createPost,
);

router.patch(
  "/:postId",
  verifyRole(UserRole.USER, UserRole.ADMIN),
  postController.updatePost,
);

router.delete(
  "/:postId",
  verifyRole(UserRole.USER, UserRole.ADMIN),
  postController.deletePost,
);

export const postRouter = router;
