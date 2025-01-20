"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

function PopularCategories() {
  const t = useTranslations("LandingPage.categories");
  const [categories, setCategories] = useState([]);

  const getIconForCategory = () => {
    return (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    );
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="relative py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`products?category=${category.id}`}
              className="group relative block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 overflow-hidden"
            >
              {/* Decorative background circle */}
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors duration-300"></div>

              <div className="relative flex items-center space-x-4">
                <div className="flex-shrink-0 p-3 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300">
                  {getIconForCategory()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 line-clamp-2 text-sm">
                    {category.description}
                  </p>
                </div>
                <div className="flex-shrink-0 text-gray-400 group-hover:text-blue-600 transition-all duration-300 transform group-hover:translate-x-1">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-4 border-2 border-blue-600 text-base font-medium rounded-full text-blue-600 bg-transparent hover:bg-blue-600 hover:text-white transition-all duration-200 space-x-2"
          >
            <span>{t("viewAll")}</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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

export default PopularCategories;
