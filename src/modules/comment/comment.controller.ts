import { Request, Response } from "express";
import { commentService } from "./comment.service";

const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;
    const result = await commentService.createPost(req.body);
    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error,
    });
  }
};

export const commentController = {
  createPost,
};
