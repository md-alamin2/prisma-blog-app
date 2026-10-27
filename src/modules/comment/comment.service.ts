import { prisma } from "../../lib/prisma";

const createPost = async (payload: {
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

export const commentService = {
  createPost,
};
