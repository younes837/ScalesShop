export function buildCategoryTree(categories) {
  const categoryMap = new Map();
  const roots = [];

  // First pass: create map of categories
  categories.forEach((category) => {
    categoryMap.set(category.id, {
      ...category,
      children: [],
    });
  });

  // Second pass: build tree structure
  categories.forEach((category) => {
    const node = categoryMap.get(category.id);
    if (category.parentId) {
      const parent = categoryMap.get(category.parentId);
      if (parent) {
        parent.children.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  return roots;
}

export function flattenCategoryTree(tree, level = 0) {
  return tree.reduce((flat, node) => {
    return [
      ...flat,
      { ...node, level },
      ...flattenCategoryTree(node.children, level + 1),
    ];
  }, []);
}

export function getCategoryPath(category, categories) {
  const path = [category];
  let current = category;

  while (current.parentId) {
    const parent = categories.find((c) => c.id === current.parentId);
    if (!parent) break;
    path.unshift(parent);
    current = parent;
  }

  return path;
}
