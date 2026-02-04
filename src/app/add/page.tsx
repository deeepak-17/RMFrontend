"use client";

import React from "react";
import { AddFoodForm } from "@/components/food/AddFoodForm";
import { AlertCircle } from "lucide-react";

export default function AddFoodPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-24 md:pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Post Surplus Food</h1>
            <p className="text-gray-500 font-medium">
              Share your excess food with the community and prevent waste.
            </p>
          </div>

          <AddFoodForm />

          {/* Humanitarian Note */}
          <div className="mt-8 bg-primary/5 border border-primary/10 rounded-2xl p-4 flex gap-4">
            <AlertCircle className="w-6 h-6 text-primary shrink-0" />
            <p className="text-sm text-primary/80 leading-relaxed">
              <span className="font-bold">Community Note:</span> By posting this, you confirm the food is safe for consumption and follows local hygiene standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
