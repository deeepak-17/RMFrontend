"use client";

import React from "react";
import Image from "next/image";
import { Clock, MapPin, CheckCircle2, ChevronRight, History } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const CLAIMED_ITEMS = [
  {
    id: "1",
    title: "Surprise Bag - Artisan Bakery",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
    businessName: "The Golden Crust",
    location: "London, Covent Garden",
    pickupTime: "18:00 - 19:00 Today",
    status: "ready", // ready, completed, expired
  },
  {
    id: "2",
    title: "Eco-Friendly Veggie Box",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
    businessName: "Green Grocers",
    location: "London, Camden",
    pickupTime: "Yesterday",
    status: "completed",
  },
];

export default function PickupsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-24 md:pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">My Pickups</h1>
            <p className="text-gray-500 font-medium">Track and manage your claimed food items.</p>
          </div>
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-primary">
            <History className="w-6 h-6" />
          </div>
        </div>

        <div className="space-y-6">
          {/* Active Pickups */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Active Now
            </h2>
            <div className="grid gap-4">
              {CLAIMED_ITEMS.filter(i => i.status === "ready").map((item) => (
                <Link 
                  href={`/details/${item.id}`} 
                  key={item.id}
                  className="bg-white rounded-[24px] p-4 flex gap-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
                >
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">{item.businessName}</span>
                        <div className="bg-primary/10 text-primary text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">Ready for pickup</div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">{item.title}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-accent" />
                        {item.pickupTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        Covent Garden
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center pr-2">
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Past Pickups */}
          <section className="pt-4">
            <h2 className="text-lg font-bold text-gray-400 mb-4">Past Pickups</h2>
            <div className="grid gap-4 opacity-75">
              {CLAIMED_ITEMS.filter(i => i.status === "completed").map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-[24px] p-4 flex gap-4 border border-gray-100 grayscale-[0.5]"
                >
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Completed</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-700">{item.title}</h3>
                    <p className="text-xs text-gray-400">{item.pickupTime}</p>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 px-4 text-[10px] rounded-xl border-gray-200">
                      Leave Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Empty State Illustration would go here if no items */}
      </div>
    </div>
  );
}
