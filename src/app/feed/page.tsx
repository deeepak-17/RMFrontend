"use client";

import React from "react";
import { FoodCard } from "@/components/food/FoodCard";
import { Search, Filter, MapPin } from "lucide-react";

const FOOD_ITEMS = [
  {
    id: "1",
    title: "Surprise Bag - Artisan Bakery",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
    quantity: 5,
    location: "London, Covent Garden",
    expiryTime: "18:00 Today",
  },
  {
    id: "2",
    title: "Eco-Friendly Veggie Box",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
    quantity: 3,
    location: "London, Camden",
    expiryTime: "19:30 Today",
  },
  {
    id: "3",
    title: "Fresh Sushi Platter",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800",
    quantity: 2,
    location: "London, Soho",
    expiryTime: "21:00 Today",
  },
  {
    id: "4",
    title: "Pastry & Muffin Mix",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800",
    quantity: 8,
    location: "London, Shoreditch",
    expiryTime: "17:00 Today",
  },
  {
    id: "5",
    title: "Organic Fruit Basket",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800",
    quantity: 4,
    location: "London, Kensington",
    expiryTime: "20:00 Today",
  },
  {
    id: "6",
    title: "Gourmet Deli Sandwich",
    image: "https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?auto=format&fit=crop&q=80&w=800",
    quantity: 6,
    location: "London, Greenwich",
    expiryTime: "16:30 Today",
  },
];

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-24 md:pb-12">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Discover Food</h1>
            <p className="text-gray-500 font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Showing food within 5 miles of <span className="text-primary font-bold">London</span>
            </p>
          </div>
          
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm">
                Map View
              </button>
            </div>
          </div>

          {/* Categories (Optional but looks good) */}
          <div className="flex overflow-x-auto gap-3 pb-6 no-scrollbar">
            {["All", "Meals", "Groceries", "Baked Goods", "Desserts", "Vegan"].map((cat) => (
              <button
                key={cat}
                className={`whitespace-nowrap px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                  cat === "All"
                    ? "bg-primary text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-primary/30"
                }`}
              >
              {cat}
            </button>
          ))}
        </div>

        {/* Food Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {FOOD_ITEMS.map((item) => (
            <FoodCard key={item.id} {...item} />
          ))}
        </div>

        {/* Empty State / Loading More could go here */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 font-medium">No more surplus food in this area.</p>
          <button className="text-primary font-bold mt-2 hover:underline">Check neighboring areas</button>
        </div>
      </div>
    </div>
  );
}
