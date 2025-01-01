export function buildSearchQuery(params) {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    inStock,
    sortBy,
    sortOrder = "desc",
  } = params;

  const where = {
    isActive: true,
  };

  // Add search conditions
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
    ];
  }

  // Add category filter
  if (category) {
    where.categoryId = category;
  }

  // Add price range
  if (minPrice || maxPrice) {
    where.basePrice = {
      ...(minPrice && { gte: parseFloat(minPrice) }),
      ...(maxPrice && { lte: parseFloat(maxPrice) }),
    };
  }

  // Add stock filter
  if (inStock === "true") {
    where.stockQuantity = { gt: 0 };
  }

  // Build sort object
  const orderBy = {};
  if (sortBy) {
    orderBy[sortBy] = sortOrder;
  } else {
    orderBy.createdAt = "desc";
  }

  return {
    where,
    orderBy,
  };
}
