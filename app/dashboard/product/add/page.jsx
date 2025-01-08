"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi, productApi } from "../../utils/api";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { uploadProductImage } from "@/utils/uploadImage";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export default function AddProductPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    basePrice: "",
    stockQuantity: "",
    minOrderQuantity: 1,
    categoryId: "",
    isActive: true,
    priceTiers: [{ quantity: 1, price: "" }],
  });
  const [images, setImages] = useState([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  // Fetch categories for the select dropdown
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryApi.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: async (productFormData) => {
      try {
        // Create the product with all data including images
        const product = await productApi.create(productFormData);
        if (images.length > 0) {
          const imagePromises = images.map((image, index) =>
            uploadProductImage(
              image.file,
              product.id,
              image.altText || `${productFormData.name} image ${index + 1}`,
              index === primaryImageIndex
            )
          );
        }

        await Promise.allSettled(imagePromises);
        return product;
      } catch (error) {
        console.error("Product creation failed:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      router.push("/dashboard/product");
      toast.success("Product created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create product");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a new FormData instance
      const productFormData = new FormData();

      // Append basic product data
      productFormData.append("name", formData.name);
      productFormData.append("description", formData.description);
      productFormData.append("sku", formData.sku);
      productFormData.append("basePrice", formData.basePrice.toString());
      productFormData.append(
        "stockQuantity",
        formData.stockQuantity.toString()
      );
      productFormData.append(
        "minOrderQuantity",
        formData.minOrderQuantity.toString()
      );
      productFormData.append("categoryId", formData.categoryId);
      productFormData.append("isActive", formData.isActive.toString());

      // Add price tiers if they exist
      if (formData.priceTiers?.length > 0) {
        productFormData.append(
          "priceTiers",
          JSON.stringify(formData.priceTiers)
        );
      }

      // Add images if they exist
      if (images?.length > 0) {
        images.forEach((image, index) => {
          productFormData.append("images", image.file);
          productFormData.append(
            `imageAltTexts[${index}]`,
            image.altText || ""
          );
          if (index === primaryImageIndex) {
            productFormData.append("primaryImageIndex", index.toString());
          }
        });
      }

      await createMutation.mutateAsync(productFormData);
    } catch (error) {
      console.error("Error creating product:", error);
      // Add error handling here
    }
  };

  const addPriceTier = () => {
    if (formData.priceTiers.length === 0) {
      setFormData((prev) => ({
        ...prev,
        priceTiers: [{ quantity: 1, price: "" }],
      }));
      return;
    }

    const lastTier = formData.priceTiers[formData.priceTiers.length - 1];
    setFormData((prev) => ({
      ...prev,
      priceTiers: [
        ...prev.priceTiers,
        {
          quantity: lastTier.quantity + 1,
          price: "",
        },
      ],
    }));
  };

  const updatePriceTier = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      priceTiers: prev.priceTiers.map((tier, i) =>
        i === index ? { ...tier, [field]: value } : tier
      ),
    }));
  };

  const removePriceTier = (index) => {
    setFormData((prev) => ({
      ...prev,
      priceTiers: prev.priceTiers.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      altText: "",
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  return (
    <div className="p-4 ">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/product")}
        >
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Basic Information</h2>
          <div className="space-y-2">
            <label htmlFor="name">Name *</label>
            <Input
              id="name"
              type="text"
              required
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="sku">SKU *</label>
            <Input
              id="sku"
              type="text"
              required
              placeholder="Stock Keeping Unit"
              value={formData.sku}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, sku: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description">Description</label>
            <Textarea
              id="description"
              placeholder="Product Description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="category">Category *</label>
            <Select
              required
              value={formData.categoryId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, categoryId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Pricing and Inventory */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Pricing and Inventory</h2>

          <div className="space-y-2">
            <label htmlFor="basePrice">Base Price *</label>
            <Input
              id="basePrice"
              type="number"
              required
              step="0.01"
              min="0"
              placeholder="Base Price"
              value={formData.basePrice}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  basePrice: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="stockQuantity">Stock Quantity *</label>
            <Input
              id="stockQuantity"
              type="number"
              required
              min="0"
              placeholder="Stock Quantity"
              value={formData.stockQuantity}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  stockQuantity: parseInt(e.target.value),
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="minOrderQuantity">Minimum Order Quantity *</label>
            <Input
              id="minOrderQuantity"
              type="number"
              required
              min="1"
              placeholder="Minimum Order Quantity"
              value={formData.minOrderQuantity}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  minOrderQuantity: parseInt(e.target.value),
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="isActive">Active Status</label>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isActive: checked }))
              }
            />
          </div>
        </div>

        {/* Price Tiers */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Price Tiers</h2>
            <Button
              type="button"
              onClick={addPriceTier}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Tier
            </Button>
          </div>

          {formData.priceTiers.map((tier, index) => (
            <div key={index} className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label>Minimum Quantity</label>
                <Input
                  type="number"
                  min="1"
                  value={tier.quantity}
                  onChange={(e) =>
                    updatePriceTier(index, "quantity", parseInt(e.target.value))
                  }
                />
              </div>
              <div className="flex-1 space-y-2">
                <label>Price per Unit</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max={formData.basePrice}
                  value={tier.price}
                  onChange={(e) =>
                    updatePriceTier(index, "price", e.target.value)
                  }
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removePriceTier(index)}
                className="mb-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Image Upload */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Product Images</h2>
          <div className="space-y-2">
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            <div className="grid grid-cols-4 gap-4 mt-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.preview}
                    alt="Preview"
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <div className="mt-2 space-y-2">
                    <Input
                      type="text"
                      placeholder="Alt text"
                      value={image.altText}
                      onChange={(e) => {
                        const newImages = [...images];
                        newImages[index].altText = e.target.value;
                        setImages(newImages);
                      }}
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="primaryImage"
                        checked={index === primaryImageIndex}
                        onChange={() => setPrimaryImageIndex(index)}
                      />
                      <label>Primary</label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Add Product
        </Button>
      </form>
    </div>
  );
}
