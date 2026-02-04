"use client";

import React from "react";
import Image from "next/image";
import { Clock, MapPin, Package } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface FoodCardProps {
  id: string;
  title: string;
  image: string;
  quantity: number;
  location: string;
  expiryTime: string;
  status?: "available" | "claimed";
}

export const FoodCard = ({
  id,
  title,
  image,
  quantity,
  location,
  expiryTime,
  status = "available",
}: FoodCardProps) => {
  return (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
      <Link href={`/details/${id}`} className="relative h-48 w-full group overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <div className="bg-accent text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
            <Package className="w-3 h-3" />
            {quantity} left
          </div>
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{title}</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Clock className="w-4 h-4 text-accent" />
              <span className="font-medium text-accent">Collect by {expiryTime}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          {status === "available" ? (
            <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-12">
              Claim Pickup
            </Button>
          ) : (
            <Button variant="outline" className="w-full border-gray-200 text-gray-400 rounded-xl h-12 cursor-default" disabled>
              Claimed
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
