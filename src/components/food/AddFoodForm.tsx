"use client";

/**
 * Add Food Form Component
 * Owner: Member 3 (Donor)
 * 
 * IMPLEMENTED:
 * - Form with react-hook-form + zod validation
 * - Fields: title, foodType, quantity, unit, preparedAt, location, image, hygieneCert
 * - Auto-calculate expiry time (preparedTime + 4 hours)
 * - Get user's location via geolocation API
 * - Image upload support
 * - Calls donationsApi.create() on submit
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Package, Image as ImageIcon, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { donationsApi } from "@/lib/api";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  foodType: z.enum(["veg", "non-veg", "vegan"]),
  quantity: z.string().min(1, "Quantity is required"),
  unit: z.enum(["kg", "plates", "servings"]),
  preparedAt: z.string().min(1, "Preparation time is required"),
  address: z.string().min(5, "Pickup address is required"),
  latitude: z.string().min(1, "Latitude is required"),
  longitude: z.string().min(1, "Longitude is required"),
  description: z.string().optional(),
  hygieneCert: z.boolean().refine((val) => val === true, "You must certify hygiene conditions"),
});

type FormValues = z.infer<typeof formSchema>;

interface AddFoodFormProps {
  onSuccess?: () => void;
}

export const AddFoodForm = ({ onSuccess }: AddFoodFormProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [expiryTime, setExpiryTime] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      foodType: "veg",
      unit: "plates",
      hygieneCert: false,
    },
  });

  // Watch preparedAt to calculate expiry time
  const preparedAt = watch("preparedAt");

  useEffect(() => {
    if (preparedAt) {
      const prepared = new Date(preparedAt);
      const expiry = new Date(prepared.getTime() + 4 * 60 * 60 * 1000);
      setExpiryTime(expiry.toLocaleString());
    } else {
      setExpiryTime("");
    }
  }, [preparedAt]);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue("latitude", position.coords.latitude.toString());
          setValue("longitude", position.coords.longitude.toString());
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Could not get your location. Please enter manually.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Build FormData for image upload
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("foodType", data.foodType);
      formData.append("quantity", data.quantity);
      formData.append("unit", data.unit);
      formData.append("preparedAt", new Date(data.preparedAt).toISOString());
      formData.append("location[coordinates][0]", data.longitude);
      formData.append("location[coordinates][1]", data.latitude);
      formData.append("location[address]", data.address);
      formData.append("hygieneCert", "true");

      if (data.description) {
        formData.append("description", data.description);
      }

      if (image) {
        formData.append("image", image);
      }

      await donationsApi.create(formData);
      setSuccess(true);

      if (onSuccess) {
        onSuccess();
      } else {
        setTimeout(() => navigate("/donor/history"), 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to create donation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto p-4">
      {/* Success Alert */}
      {success && (
        <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-emerald-700">
          <CheckCircle className="h-5 w-5" />
          <span>Donation created successfully!</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-700">
          <AlertTriangle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Image Upload */}
        <div
          className="relative aspect-video w-full bg-gray-100 rounded-[20px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden group"
          onClick={() => document.getElementById("food-image")?.click()}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <>
              <ImageIcon className="w-10 h-10 text-gray-300 group-hover:text-primary transition-colors mb-2" />
              <span className="text-sm font-medium text-gray-400">Add food photo</span>
            </>
          )}
          <input
            id="food-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Food Title */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Food Title *</label>
          <input
            {...register("title")}
            type="text"
            placeholder="e.g. Rice and curry for 50 people"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        {/* Food Type & Quantity */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Food Type *</label>
            <select
              {...register("foodType")}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            >
              <option value="veg">Vegetarian</option>
              <option value="non-veg">Non-Vegetarian</option>
              <option value="vegan">Vegan</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-1">
              <Package className="w-4 h-4" /> Quantity *
            </label>
            <div className="flex gap-2">
              <input
                {...register("quantity")}
                type="number"
                placeholder="e.g. 50"
                className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
              />
              <select
                {...register("unit")}
                className="w-24 bg-white border border-gray-200 rounded-xl px-2 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
              >
                <option value="plates">plates</option>
                <option value="kg">kg</option>
                <option value="servings">servings</option>
              </select>
            </div>
            {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
          </div>
        </div>

        {/* Prepared Time with Expiry Display */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-1">
            <Clock className="w-4 h-4" /> Prepared At *
          </label>
          <input
            {...register("preparedAt")}
            type="datetime-local"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
          />
          {expiryTime && (
            <p className="text-sm text-orange-600 mt-1 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Expires at: <span className="font-medium">{expiryTime}</span>
              <span className="text-gray-500">(4-hour safety window)</span>
            </p>
          )}
          {errors.preparedAt && <p className="text-red-500 text-xs mt-1">{errors.preparedAt.message}</p>}
        </div>

        {/* Pickup Location */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-bold text-gray-700 flex items-center gap-1">
              <MapPin className="w-4 h-4" /> Pickup Location *
            </label>
            <button
              type="button"
              onClick={getCurrentLocation}
              className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <MapPin className="h-4 w-4" />
              Use Current Location
            </button>
          </div>
          <input
            {...register("address")}
            type="text"
            placeholder="e.g. 42 Baker St, Chennai"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none mb-2"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              {...register("latitude")}
              type="number"
              step="any"
              placeholder="Latitude"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            />
            <input
              {...register("longitude")}
              type="number"
              step="any"
              placeholder="Longitude"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            />
          </div>
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
          {(errors.latitude || errors.longitude) && (
            <p className="text-red-500 text-xs mt-1">Coordinates are required</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Description (Optional)</label>
          <textarea
            {...register("description")}
            placeholder="What's included? Any special instructions?"
            rows={3}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
          />
        </div>

        {/* Hygiene Certification */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            {...register("hygieneCert")}
            id="hygiene"
            className="mt-1"
          />
          <label htmlFor="hygiene" className="text-sm text-gray-700">
            I certify this food was prepared in hygienic conditions and is safe for consumption *
          </label>
        </div>
        {errors.hygieneCert && <p className="text-red-500 text-xs">{errors.hygieneCert.message}</p>}
      </div>

      <Button
        type="submit"
        variant="default"
        className="w-full h-14 text-lg shadow-lg bg-emerald-600 hover:bg-emerald-700"
        disabled={isLoading || success}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Submitting...
          </>
        ) : success ? (
          <>
            <CheckCircle className="w-5 h-5 mr-2" />
            Donation Posted!
          </>
        ) : (
          "Post Surplus Food"
        )}
      </Button>
    </form>
  );
};
