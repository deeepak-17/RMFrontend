"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Clock, MapPin, Package, Heart, Share2, Info, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function FoodDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  // Mock data for demonstration
  const foodItem = {
    id,
    title: "Surprise Bag - Artisan Bakery",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200",
    quantity: 5,
    location: "London, Covent Garden",
    expiryTime: "18:00 Today",
    description: "A delicious variety of our daily fresh-baked goods. May include sourdough bread, croissants, pain au chocolat, and seasonal muffins. All items are baked this morning and are perfectly good to eat!",
    businessName: "The Golden Crust",
    rating: 4.8,
    reviews: 124,
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-12">
      {/* Hero Header for Mobile */}
      <div className="relative h-72 md:h-96 w-full">
        <Image
          src={foodItem.image}
          alt={foodItem.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <Link 
          href="/feed"
          className="absolute top-6 left-6 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-gray-900 active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        
        <div className="absolute top-6 right-6 flex gap-3">
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-gray-900 active:scale-95 transition-transform">
            <Heart className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-gray-900 active:scale-95 transition-transform">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute bottom-6 left-6 right-6 text-white">
          <h1 className="text-3xl font-extrabold mb-1">{foodItem.title}</h1>
          <p className="text-white/90 font-medium flex items-center gap-2">
            {foodItem.businessName} • ★ {foodItem.rating} ({foodItem.reviews} reviews)
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-4">About this bag</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {foodItem.description}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-100">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Quantity</span>
                  <div className="flex items-center gap-2 text-primary font-bold text-lg">
                    <Package className="w-5 h-5" />
                    {foodItem.quantity} items left
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Collect by</span>
                  <div className="flex items-center gap-2 text-accent font-bold text-lg">
                    <Clock className="w-5 h-5" />
                    {foodItem.expiryTime}
                  </div>
                </div>
                <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
                  <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Location</span>
                  <div className="flex items-center gap-2 text-gray-700 font-bold text-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                    {foodItem.location}
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Info className="w-6 h-6 text-primary" />
                What you need to know
              </h2>
              <ul className="space-y-4 text-gray-600">
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-xs">1</div>
                  <span>Bring your own bag to help us reduce even more waste.</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-xs">2</div>
                  <span>Show your digital receipt at the counter for pickup.</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-xs">3</div>
                  <span>Contents of Surprise Bags vary daily depending on surplus.</span>
                </li>
              </ul>
            </section>
          </div>

          {/* Sticky Sidebar for desktop */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-[32px] p-8 shadow-lg border border-gray-100 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-extrabold text-primary">Free</span>
                <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-bold">
                  Community Share
                </span>
              </div>
              
              <div className="space-y-3">
                <p className="text-gray-500 text-sm font-medium">
                  By claiming this, you agree to collect it before <span className="text-accent font-bold">{foodItem.expiryTime}</span>.
                </p>
                  <Button className="w-full py-8 text-xl rounded-xl shadow-lg shadow-primary/20">
                    Claim Pickup
                  </Button>
                <p className="text-center text-xs text-gray-400 font-medium">
                  Reserved items are held for 15 minutes.
                </p>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h4 className="font-bold text-gray-900 mb-4">Location Map</h4>
                <div className="w-full h-40 bg-gray-100 rounded-2xl relative overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800"
                    alt="Map"
                    fill
                    className="object-cover opacity-50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-primary animate-bounce" />
                  </div>
                </div>
                <p className="mt-4 text-sm font-bold text-gray-700">{foodItem.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
