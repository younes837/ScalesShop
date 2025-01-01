import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    id: 1,
    name: "Office Supplies",
    image: "/images/categories/office-supplies.jpg",
    href: "/catalog/office-supplies",
    description: "Everything you need for your office",
  },
  {
    id: 2,
    name: "Electronics",
    image: "/images/categories/electronics.jpg",
    href: "/catalog/electronics",
    description: "Latest tech for your business",
  },
  {
    id: 3,
    name: "Furniture",
    image: "/images/categories/furniture.jpg",
    href: "/catalog/furniture",
    description: "Commercial grade furniture solutions",
  },
  {
    id: 4,
    name: "Safety Equipment",
    image: "/images/categories/safety.jpg",
    href: "/catalog/safety",
    description: "Keep your workplace safe",
  },
  {
    id: 5,
    name: "Packaging",
    image: "/images/categories/packaging.jpg",
    href: "/catalog/packaging",
    description: "Professional packaging solutions",
  },
  {
    id: 6,
    name: "Cleaning Supplies",
    image: "/images/categories/cleaning.jpg",
    href: "/catalog/cleaning",
    description: "Industrial cleaning products",
  },
];

export default function PopularCategories() {
  return (
    <section id="categories" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Popular Categories
          </h2>
          <p className="text-xl text-gray-600">
            Browse our most popular product categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group block overflow-hidden rounded-lg border hover:border-blue-600 transition-colors"
            >
              <div className="relative h-48 sm:h-64">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/catalog"
            className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700"
          >
            View All Categories
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
