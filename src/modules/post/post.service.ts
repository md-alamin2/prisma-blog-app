import { Post } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

// create post service logic
const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string,
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

// get all post service logic
const getAllPost = async (payload: {
  search: string | undefined;
  tags: string[];
}) => {
  const allFilters: PostWhereInput[] = [];

  // adding search value
  if (payload.search !== undefined) {
    allFilters.push({
      OR: [
        {
          title: {
            contains: payload.search as string,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: payload.search as string,
            mode: "default",
          },
        },
        {
          tags: {
            has: payload.search as string,
          },
        },
      ],
    });
  }

  // adding tags value
  if (payload.tags.length > 0) {
    allFilters.push({
      tags: {
        hasEvery: payload.tags,
      },
    });
  }

  const result = await prisma.post.findMany({
    where: {
      AND: allFilters,
    },
  });
  return result;
};

export const postService = {
  createPost,
  getAllPost,
};
