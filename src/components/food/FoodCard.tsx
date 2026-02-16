"use client";

/**
 * Food Card Component
 * Owner: Member 3 (Donor)
 * 
 * IMPLEMENTED:
 * - Display donation details (image, title, quantity, location, expiry)
 * - Status badge (available, reserved, collected, expired)
 * - Time remaining until expiry
 * - Edit/Delete buttons for donor's own donations
 * - Claim button for NGO/Volunteer view
 */

import { useState } from "react";
import { Image } from "@/components/ui/image";
import { Clock, MapPin, Package, Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { FoodDonation } from "@/types";

interface FoodCardProps {
  // Basic props for backward compatibility
  id?: string;
  title?: string;
  image?: string;
  quantity?: number;
  location?: string;
  expiryTime?: string;
  status?: "available" | "claimed" | "reserved" | "collected" | "expired";

  // Full donation object (preferred)
  donation?: FoodDonation;

  // Action handlers for donor view
  onEdit?: (donation: FoodDonation) => void;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;

  // View mode
  showActions?: boolean; // true for donor view, false for NGO/volunteer browse
}

// Calculate time remaining until expiry
function getTimeRemaining(expiryTime: string): { text: string; isUrgent: boolean; isExpired: boolean } {
  const now = new Date();
  const expiry = new Date(expiryTime);
  const diff = expiry.getTime() - now.getTime();

  if (diff <= 0) return { text: "Expired", isUrgent: true, isExpired: true };

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 2) return { text: `${hours}h ${minutes}m`, isUrgent: false, isExpired: false };
  if (hours > 0) return { text: `${hours}h ${minutes}m`, isUrgent: true, isExpired: false };
  return { text: `${minutes}m`, isUrgent: true, isExpired: false };
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    available: "bg-green-100 text-green-700",
    reserved: "bg-yellow-100 text-yellow-700",
    collected: "bg-blue-100 text-blue-700",
    expired: "bg-red-100 text-red-700",
    claimed: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full font-medium ${styles[status] || styles.available}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export const FoodCard = ({
  id,
  title,
  image,
  quantity,
  location,
  expiryTime,
  status = "available",
  donation,
  onEdit,
  onDelete,
  isDeleting = false,
  showActions = false,
}: FoodCardProps) => {
  // Use donation object if provided, otherwise use individual props
  const cardId = donation?._id || id || "";
  const cardTitle = donation?.title || title || "Food Donation";
  const cardImage = donation?.imageUrl || image || "/placeholder-food.jpg";
  const cardQuantity = donation?.quantity || quantity || 0;
  const cardUnit = donation?.unit || "plates";
  const cardLocation = donation?.location?.address || location || "Location not specified";
  const cardExpiryTime = donation?.expiryTime || expiryTime || "";
  const cardStatus = donation?.status || status;
  const cardFoodType = donation?.foodType || "veg";

  const timeInfo = cardExpiryTime ? getTimeRemaining(cardExpiryTime) : null;

  return (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
      {/* Image Section */}
      <Link to={`/details/${cardId}`} className="relative h-48 w-full group overflow-hidden">
        <Image
          src={cardImage}
          alt={cardTitle}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Quantity Badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          <div className="bg-accent text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
            <Package className="w-3 h-3" />
            {cardQuantity} {cardUnit}
          </div>
          {/* Food Type Badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${cardFoodType === "veg" ? "bg-green-500 text-white" :
              cardFoodType === "vegan" ? "bg-emerald-500 text-white" :
                "bg-red-500 text-white"
            }`}>
            {cardFoodType === "veg" ? "🥬 Veg" : cardFoodType === "vegan" ? "🌱 Vegan" : "🍗 Non-Veg"}
          </div>
        </div>
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <StatusBadge status={cardStatus} />
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{cardTitle}</h3>
          <div className="flex flex-col gap-2">
            {/* Location */}
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="line-clamp-1">{cardLocation}</span>
            </div>
            {/* Expiry Time */}
            {timeInfo && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className={`w-4 h-4 ${timeInfo.isUrgent ? "text-red-500" : "text-accent"}`} />
                <span className={`font-medium ${timeInfo.isUrgent ? "text-red-500" : "text-accent"}`}>
                  {timeInfo.isExpired ? "Expired" : `Collect within ${timeInfo.text}`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto">
          {showActions && onEdit && onDelete ? (
            // Donor View - Edit/Delete buttons
            <div className="flex gap-2">
              {cardStatus === "available" && (
                <>
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl h-12"
                    onClick={() => donation && onEdit(donation)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl h-12 border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => onDelete(cardId)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </>
                    )}
                  </Button>
                </>
              )}
              {cardStatus !== "available" && (
                <Button
                  variant="outline"
                  className="w-full border-gray-200 text-gray-400 rounded-xl h-12 cursor-default"
                  disabled
                >
                  {cardStatus === "collected" ? "Collected ✓" : cardStatus === "reserved" ? "Reserved" : "Unavailable"}
                </Button>
              )}
            </div>
          ) : (
            // NGO/Volunteer View - Claim button
            cardStatus === "available" ? (
              <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-12">
                Claim Pickup
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full border-gray-200 text-gray-400 rounded-xl h-12 cursor-default"
                disabled
              >
                {cardStatus === "claimed" || cardStatus === "reserved" ? "Reserved" : "Unavailable"}
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
