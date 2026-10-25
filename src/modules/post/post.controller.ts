import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";

const createPost = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        success: false,
        message: "Unauthorize access",
      });
    }
    const result = await postService.createPost(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    // for search query
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;

    // for tags query
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    // for isFeatured query
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
          ? false
          : undefined
      : undefined;

    // for status query
    const status = req.query.status as PostStatus | undefined;

    // fo authorId query
    const authorId = req.query.authorId as string | undefined;

    // calling the get data function
    const result = await postService.getAllPost({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId,
    });
    res.status(200).json({
      success: true,
      message: "Get all post",
      data: result,
    });
  } catch (err: any) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

export const postController = {
  createPost,
  getAllPost,
};
