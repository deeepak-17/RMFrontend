"use client";


import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Package, Image as ImageIcon } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  quantity: z.string().min(1, "Quantity is required"),
  location: z.string().min(5, "Location is required"),
  expiryTime: z.string().min(1, "Expiry time is required"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const AddFoodForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    alert("Food posted successfully!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto p-4">
      <div className="space-y-4">
        <div className="relative aspect-video w-full bg-gray-100 rounded-[20px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden group">
          <ImageIcon className="w-10 h-10 text-gray-300 group-hover:text-primary transition-colors mb-2" />
          <span className="text-sm font-medium text-gray-400">Add food photo</span>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Food Title</label>
          <input
            {...register("title")}
            type="text"
            placeholder="e.g. Mixed Bakery Box"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-1">
              <Package className="w-4 h-4" /> Quantity
            </label>
            <input
              {...register("quantity")}
              type="text"
              placeholder="e.g. 5 boxes"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            />
            {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-1">
              <Clock className="w-4 h-4" /> Expiry Time
            </label>
            <input
              {...register("expiryTime")}
              type="time"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            />
            {errors.expiryTime && <p className="text-red-500 text-xs mt-1">{errors.expiryTime.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-1">
            <MapPin className="w-4 h-4" /> Pickup Location
          </label>
          <input
            {...register("location")}
            type="text"
            placeholder="e.g. 42 Baker St, London"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
          />
          {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Description (Optional)</label>
          <textarea
            {...register("description")}
            placeholder="What's inside the box?"
            rows={3}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
          />
        </div>
      </div>

      <Button type="submit" variant="default" className="w-full h-14 text-lg shadow-lg">
        Post Surplus Food
      </Button>
    </form>
  );
};
