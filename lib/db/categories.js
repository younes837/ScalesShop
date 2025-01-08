export async function getCategories() {
  try {
    const categories = await db.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
      },
      take: 6, // Limit to 6 categories for the popular section
      orderBy: {
        products: {
          _count: "desc", // Order by number of products to show most popular
        },
      },
    });
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
