type helperOptions = {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
};

type helperOptionsReturn = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
};

const paginationSortingHelper = (
  options: helperOptions,
): helperOptionsReturn => {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 8;
  const skip: number = (page - 1) * limit;

  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "asc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export default paginationSortingHelper;
