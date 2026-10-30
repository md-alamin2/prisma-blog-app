import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const getCommentById = async (commentId: string) => {
  const result = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          views: true,
        },
      },
    },
  });

  return result;
};

const getCommentByAuthorId = async (authorId: string) => {
  const result = await prisma.comment.findMany({
    where: {
      authorId,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return result;
};

const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
}) => {
  // check if post exists
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  //   if the parent exists
  if (payload.parentId) {
    await prisma.comment.findUniqueOrThrow({
      where: {
        id: payload.parentId,
      },
    });
  }

  const result = await prisma.comment.create({
    data: payload,
  });
  return result;
};

const updateComment = async (
  commentId: string,
  authorId: string,
  data: { content?: string; status?: CommentStatus },
) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId,
    },
  });

  if (!commentData) {
    throw new Error("Your provided input is invalid!");
  }

  const result = await prisma.comment.update({
    where: {
      id: commentId,
      authorId,
    },
    data,
  });

  return result;
};

// 1. nijer comment korte parbe
// login thakte hobe
// tar nijer comment ta eta check korte hobe
const deleteComment = async (commentId: string, authorId: string) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId,
    },
  });

  if (!commentData) {
    throw new Error("Your provided input is invalid!");
  }

  const result = await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  return result;
};

const moderateComment = async (commentId: string, data: CommentStatus) => {
  const ifCommentExists = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (ifCommentExists.status === data) {
    throw new Error(`Your provided type(${data}) already exists`);
  }

  const result = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      status: data,
    },
  });

  return result;
};

export const commentService = {
  createComment,
  getCommentById,
  getCommentByAuthorId,
  updateComment,
  deleteComment,
  moderateComment,
};
