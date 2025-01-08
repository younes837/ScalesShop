"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi, productApi } from "../../utils/api";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
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
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";

export default function ProductPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(null);
  const [images, setImages] = useState([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

  // Fetch categories first
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getAll,
  });

  // Fetch product data
  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["products", params.id],
    queryFn: () => productApi.getById(params.id),
    enabled: !!params.id,
  });

  // Wait for both product and categories to be loaded
  useEffect(() => {
    if (product && categories.length > 0) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        sku: product.sku || "",
        basePrice: product.basePrice?.toString() || "0",
        stockQuantity: product.stockQuantity?.toString() || "0",
        minOrderQuantity: product.minOrderQuantity || 1,
        categoryId: product.categoryId,
        isActive: product.isActive ?? true,
        priceTiers:
          product.priceTiers?.length > 0
            ? product.priceTiers.map((tier) => ({
                quantity: tier.minQuantity,
                price: tier.pricePerUnit.toString(),
              }))
            : [{ quantity: 1, price: "" }],
      });

      if (product.images?.length > 0) {
        setImages(
          product.images.map((img) => ({
            id: img.id,
            file: null,
            preview: img.imageUrl,
            altText: img.altText || "",
            isExisting: true,
          }))
        );
        const primaryIndex = product.images.findIndex((img) => img.isPrimary);
        if (primaryIndex !== -1) setPrimaryImageIndex(primaryIndex);
      }
    }
  }, [product, categories]); // Add categories to dependencies

  // Add useEffect to monitor formData changes

  const updateMutation = useMutation({
    mutationFn: async (productFormData) => {
      try {
        // First update the product basic info
        const updateData = {
          id: params.id,
          name: formData.name,
          description: formData.description,
          sku: formData.sku,
          basePrice: formData.basePrice,
          stockQuantity: formData.stockQuantity,
          minOrderQuantity: formData.minOrderQuantity,
          categoryId: formData.categoryId || product.categoryId,
          isActive: formData.isActive,
          priceTiers: formData.priceTiers,
        };

        const updatedProduct = await productApi.update(updateData);

        // Handle new images
        const newImages = images.filter(
          (image) => !image.isExisting && image.file
        );

        if (newImages.length > 0) {
          try {
            console.log("Preparing to upload images:", newImages.length);
            const imageFormData = new FormData();

            // Add each new image and its alt text
            newImages.forEach((image, index) => {
              if (image.file) {
                imageFormData.append("images", image.file);
                imageFormData.append("imageAltTexts", image.altText || "");
              }
            });

            // Add product ID and primary image info
            imageFormData.append("productId", updatedProduct.id);
            const newImagePrimaryIndex = newImages.findIndex(
              (_, index) =>
                index + images.filter((img) => img.isExisting).length ===
                primaryImageIndex
            );
            imageFormData.append(
              "primaryImageIndex",
              newImagePrimaryIndex.toString()
            );

            // Upload the new images
            const response = await productApi.uploadImages(imageFormData);
            if (response.success) {
              console.log("Images uploaded successfully:", response.images);
            } else {
              throw new Error(response.error || "Failed to upload images");
            }
          } catch (uploadError) {
            console.error("Failed to upload images:", uploadError);
            toast.error("Failed to upload some images");
            // Continue with the update even if image upload fails
          }
        }

        // Update existing images' primary status
        const existingImages = images.filter((img) => img.isExisting);
        if (existingImages.length > 0) {
          await productApi.updateImages({
            productId: params.id,
            existingImageIds: existingImages.map((img) => img.id),
            primaryImageId: images[primaryImageIndex]?.id,
          });
        }

        return updatedProduct;
      } catch (error) {
        console.error(
          "Update error:",
          error?.response?.data || error?.message || "Unknown error"
        );
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      toast.success("Product updated successfully");
      router.push("/dashboard/product");
    },
    onError: (error) => {
      console.error("Mutation error:", error?.message || "Unknown error");
      toast.error(error?.message || "Failed to update product");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync(formData); // Pass formData directly
    } catch (error) {
      console.error("Submit error:", error?.message || "Unknown error");
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

  const handleRemoveImage = async (index) => {
    const image = images[index];
    try {
      if (image.isExisting) {
        // If it's an existing image, delete it from the server
        await productApi.deleteImage(params.id, image.id);
        toast.success("Image removed successfully");
      }
      // Remove from local state
      setImages(images.filter((_, i) => i !== index));
      // Adjust primary image index if needed
      if (index === primaryImageIndex) {
        setPrimaryImageIndex(0);
      } else if (index < primaryImageIndex) {
        setPrimaryImageIndex(primaryImageIndex - 1);
      }
    } catch (error) {
      toast.error("Failed to remove image");
    }
  };

  if (isLoadingProduct || !formData || categories.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner className="h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/product")}
          >
            Cancel
          </Button>
          <Button form="product-form">Save Changes</Button>
        </div>
      </div>

      <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Basic Information</h2>
          <div className="space-y-2">
            <label htmlFor="name">Name *</label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description">Description</label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="sku">SKU *</label>
            <Input
              id="sku"
              required
              value={formData.sku}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, sku: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category">Category *</label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, categoryId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue>
                  {categories.find((c) => c.id === formData.categoryId)?.name ||
                    "Select a category"}
                </SelectValue>
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
                  <div className="relative group">
                    <img
                      src={image.preview}
                      alt="Preview"
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
      </form>
    </div>
  );
}
