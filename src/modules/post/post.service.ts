import { boolean } from "better-auth";
import {
  CommentStatus,
  Post,
  PostStatus,
} from "../../../generated/prisma/client";
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
  skip,
  sortBy,
  sortOrder,
}: {
  search: string | undefined;
  tags: string[];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
  authorId: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
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

  // result function
  const result = await prisma.post.findMany({
    skip: skip,
    take: limit,
    where: {
      AND: allFilters,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  // get total data count
  const total = await prisma.post.count({
    where: {
      AND: allFilters,
    },
  });

  const data = {
    result,
    paginationData: {
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    },
  };
  return data;
};

// get single post by id
const getSinglePost = async (postId: string) => {
  return await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    const result = await tx.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        comments: {
          where: {
            parentId: null,
            status: CommentStatus.APPROVED,
          },
          orderBy: { createdAt: "desc" },
          include: {
            replies: {
              where: {
                status: CommentStatus.APPROVED,
              },
              orderBy: { createdAt: "asc" },
            },
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
    return result;
  });
};

// get my post
const getMyPost = async (id: string) => {
  const result = await prisma.post.findMany({
    where: {
      authorId: id,
    },
  });

  return result
};

export const postService = {
  createPost,
  getAllPost,
  getSinglePost,
  getMyPost
};
