import { boolean } from "better-auth";
import { Post, PostStatus } from "../../../generated/prisma/client";
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
const getAllPost = async ({
  search,
  tags,
  isFeatured,
  status,
  authorId,
  page,
  limit,
}: {
  search: string | undefined;
  tags: string[];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
  authorId: string | undefined;
  page: number;
  limit: number;
}) => {
  const allFilters: PostWhereInput[] = [];

  // adding search value
  if (search !== undefined) {
    allFilters.push({
      OR: [
        {
          title: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search as string,
            mode: "default",
          },
        },
        {
          tags: {
            has: search as string,
          },
        },
      ],
    });
  }

  // adding tags value
  if (tags.length > 0) {
    allFilters.push({
      tags: {
        hasEvery: tags,
      },
    });
  }

  // adding isFeatured value
  if (typeof isFeatured === "boolean") {
    allFilters.push({ isFeatured });
  }

  // adding status value
  if (status) {
    allFilters.push({ status });
  }

  // adding authorId value
  if (authorId) {
    allFilters.push({ authorId });
  }

  // pagination skip calculation
  const skipPost = (page - 1) * limit;

  // result function
  const result = await prisma.post.findMany({
    skip: skipPost,
    take: limit,
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
