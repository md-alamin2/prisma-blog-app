import { Request, Response } from "express";
import { commentService } from "./comment.service";

const getCommentById = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const result = await commentService.getCommentById(commentId as string);
    res.status(200).json({
      success: true,
      message: "Comment get successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error,
    });
  }
};

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;
    const result = await commentService.createComment(req.body);
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
  createComment,
  getCommentById
};
