"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductImages({ images }) {
  const [selectedImage, setSelectedImage] = useState(
    images.find((img) => img.isPrimary) || images[0]
  );

  return (
    <div>
      {/* Main Image */}
      <div className="aspect-square relative rounded-lg overflow-hidden bg-background mb-4">
        <Image
          src={"/kitchen_scale.png"}
          alt={selectedImage?.altText || "Product image"}
          fill
          className="object-contain"
          priority
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">
            Popular
          </span>
        </div>
      </div>

      {/* Thumbnail Images */}
      <div className="grid grid-cols-4 gap-4">
        {images.map((image) => (
          <button
            key={image.id}
            onClick={() => setSelectedImage(image)}
            className={cn(
              "relative aspect-square rounded-lg overflow-hidden bg-background border-2",
              selectedImage.id === image.id
                ? "border-primary"
                : "border-transparent hover:border-muted"
            )}
          >
            <Image
              src={"/kitchen_scale.png"}
              alt={image.altText || "Product thumbnail"}
              fill
              className="object-contain p-2"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
