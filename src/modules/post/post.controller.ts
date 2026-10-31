import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { UserRole } from "../../middleware/verifyRole";

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

    // pagination and sorting helper function
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query,
    );

    // calling the get data function
    const result = await postService.getAllPost({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
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

const getSinglePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      throw new Error("please add an valid id");
    }
    const result = await postService.getSinglePost(postId as string);
    res.status(200).json({
      success: true,
      message: "Post get successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

const getMyPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("Forbidden access");
    }
    const result = await postService.getMyPost(user.id as string);
    res.status(200).json({
      success: true,
      message: "Your post get successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const user = req.user;
    if (!user) {
      throw new Error("Forbidden access");
    }
    const isAdmin = user.role === UserRole.ADMIN
    const result = await postService.updatePost(
      postId as string,
      req.body,
      user.id,
      isAdmin
    );
    res.status(200).json({
      success: true,
      message: "Your post get successfully",
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
  getSinglePost,
  getMyPost,
  updatePost
};
