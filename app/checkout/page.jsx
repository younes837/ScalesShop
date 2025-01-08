"use client";
import { useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { useCartStore } from "@/lib/store/cart";
import { toast } from "sonner";
import { formatOrderForWhatsApp, sendToWhatsApp } from "@/lib/utils/whatsapp";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

// Move InputField outside the main component
const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  error,
  ...props
}) => (
  <div className="space-y-2">
    <Label htmlFor={name} className="text-sm font-medium text-gray-700">
      {label} {props.required && <span className="text-red-500">*</span>}
    </Label>
    <Input
      type={type}
      id={name}
      name={name}
      placeholder={placeholder}
      className={`${
        error
          ? "border-red-500 focus:ring-red-500"
          : "border-input hover:border-gray-300"
      }`}
      {...props}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default function CheckoutPage() {
  const cartStore = useCartStore();
  const cart = cartStore.items || [];
  const router = useRouter();

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apt: "",
    city: "",
    country: "",
    postalCode: "",
    phone: "",
  });

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const delivery = 0;
  const tax = subtotal * 0.15;
  const [discount, setDiscount] = useState(0);
  const total = subtotal + tax - discount;

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!shippingInfo.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Required fields validation
    const requiredFields = {
      firstName: "First name",
      lastName: "Last name",
      address: "Address",
      city: "City",
      country: "Country",
      postalCode: "Postal code",
      phone: "Phone number",
    };

    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!shippingInfo[field]?.trim()) {
        newErrors[field] = `${label} is required`;
      }
    });

    // Phone validation for Morocco numbers
    if (!shippingInfo.phone) {
      newErrors.phone = "Phone number is required";
    } else {
      // Remove spaces and dashes for validation
      const cleanPhone = shippingInfo.phone.replace(/[\s-]/g, "");
      // Check if it starts with +212 and has 9 digits after
      if (!/^\+212[5-7]\d{8}$/.test(cleanPhone)) {
        newErrors.phone = "Please enter a valid Moroccan phone number";
      }
    }

    // Postal code validation
    if (
      shippingInfo.postalCode &&
      !/^[\d\w\s-]{4,10}$/.test(shippingInfo.postalCode)
    ) {
      newErrors.postalCode = "Please enter a valid postal code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // If phone field is empty, add the country code
      if (!value) {
        setShippingInfo((prev) => ({
          ...prev,
          [name]: "+212 ",
        }));
      } else {
        // Only allow numbers, spaces, and dashes after +212
        const cleanValue = value.replace(/[^\d\s-]/g, "");
        setShippingInfo((prev) => ({
          ...prev,
          [name]: value.startsWith("+212") ? value : "+212 " + cleanValue,
        }));
      }
    } else {
      setShippingInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRemoveItem = (itemId) => {
    cartStore.removeItem(itemId);
    toast.success("Item removed from cart");
  };

  const handleApplyCoupon = () => {
    toast.error("Coupon functionality not implemented yet");
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        cart,
        shippingInfo,
        subtotal,
        delivery,
        tax,
        discount,
        total,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process order");
      }

      // Open WhatsApp with the pre-filled message
      window.open(data.whatsappUrl, "_blank");

      toast.success("Order placed successfully!");
      cartStore.clearCart();
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to process checkout");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <span>Home</span>
          <span>›</span>
          <span className="text-gray-900">Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold mb-6">
                Shipping Information
              </h2>

              <div className="space-y-6">
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={shippingInfo.email}
                  onChange={handleInputChange}
                  error={errors.email}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="First Name"
                    name="firstName"
                    placeholder="Enter first name"
                    required
                    value={shippingInfo.firstName}
                    onChange={handleInputChange}
                    error={errors.firstName}
                  />
                  <InputField
                    label="Last Name"
                    name="lastName"
                    placeholder="Enter last name"
                    required
                    value={shippingInfo.lastName}
                    onChange={handleInputChange}
                    error={errors.lastName}
                  />
                </div>

                <InputField
                  label="Address"
                  name="address"
                  placeholder="Street address"
                  required
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  error={errors.address}
                />

                <InputField
                  label="Apartment, suite, etc."
                  name="apt"
                  placeholder="Apartment, suite, or floor"
                  value={shippingInfo.apt}
                  onChange={handleInputChange}
                  error={errors.apt}
                />

                <div className="grid grid-cols-2 gap-6">
                  <InputField
                    label="City"
                    name="city"
                    placeholder="Enter city"
                    required
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    error={errors.city}
                  />
                  <div className="space-y-2">
                    <Label
                      htmlFor="country"
                      className="text-sm font-medium text-gray-700"
                    >
                      Country <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="country"
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleInputChange}
                      className={`w-full h-10 px-3 rounded-md border focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 focus:border-transparent transition-colors
                        ${
                          errors.country
                            ? "border-red-500 bg-red-50"
                            : "border-input hover:border-gray-300"
                        }`}
                      required
                    >
                      <option value="">Select country</option>

                      <option value="UK">Morocco</option>
                    </select>
                    {errors.country && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.country}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <InputField
                    label="Postal Code"
                    name="postalCode"
                    placeholder="Enter postal code"
                    required
                    value={shippingInfo.postalCode}
                    onChange={handleInputChange}
                    error={errors.postalCode}
                  />
                  <InputField
                    label="Phone"
                    name="phone"
                    type="tel"
                    placeholder="+212 6XX-XXXXXX"
                    required
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    error={errors.phone}
                    onFocus={(e) => {
                      // Add country code if empty when focused
                      if (!e.target.value) {
                        setShippingInfo((prev) => ({
                          ...prev,
                          phone: "+212 ",
                        }));
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold mb-6">Your Order</h2>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-4 border-b border-gray-100 group"
                >
                  <div className="w-20 h-20 bg-gray-50 rounded-lg relative overflow-hidden">
                    <Image
                      src={
                        item.images[0]?.imageUrl || "/images/placeholder.jpg"
                      }
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium line-clamp-1">{item.name}</h3>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                    <div className="flex justify-between mt-2">
                      <span className="font-medium">
                        ${item.price.toFixed(2)}
                      </span>
                      <span className="text-gray-500">x {item.quantity}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter coupon code"
                  className="flex-1"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-6 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                >
                  Apply
                </button>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span>${delivery.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg pt-3 border-t">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isSubmitting || cart.length === 0}
                className={`w-full mt-6 py-4 rounded-lg font-medium transition-colors
                  ${
                    isSubmitting || cart.length === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
              >
                {isSubmitting ? "Processing..." : "Checkout"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
