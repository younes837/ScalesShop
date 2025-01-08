"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../../../utils/api";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function EditProductPage({ params }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(null);

  const { data: product, isLoading } = useQuery({
    queryKey: ["products", params.id],
    queryFn: () => productApi.getById(params.id),
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const updateMutation = useMutation({
    mutationFn: productApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      router.push("/dashboard/product");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate({ id: params.id, ...formData });
  };

  if (isLoading || !formData) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner className="h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  // Rest of the form JSX similar to AddProductPage but with "Update Product" button
  // ...
}
