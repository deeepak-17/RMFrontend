import { FoodDonation } from "@/types";
import { CheckCircle2, Clock, Package } from "lucide-react";
import { format } from "date-fns";

interface TimelineProps {
    donation: FoodDonation;
}

export function ChainOfCustodyTimeline({ donation }: TimelineProps) {
    const steps = [
        {
            label: "Donation Posted",
            date: donation.createdAt,
            icon: Package,
            completed: true,
            description: `Posted by ${(typeof donation.donorId === 'object' ? donation.donorId?.name : null) || 'Donor'}`,
            color: "text-blue-600 bg-blue-100",
        },
        {
            label: "Reserved by NGO",
            date: donation.reservedAt,
            icon: Clock,
            completed: !!donation.reservedAt,
            description: donation.reservedBy ? "NGO has claimed this donation" : "Waiting for NGO...",
            color: "text-yellow-600 bg-yellow-100",
        },
        {
            label: "Collected & Verified",
            date: donation.collectedAt,
            icon: CheckCircle2,
            completed: !!donation.collectedAt,
            description: "Donation picked up and verified",
            color: "text-green-600 bg-green-100",
        },
    ];

    return (
        <div className="relative space-y-8 p-4">
            {/* Vertical Line */}
            <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-gray-200" />

            {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                    <div key={index} className="relative flex items-start gap-4">
                        {/* Icon Bubble */}
                        <div
                            className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${step.completed
                                ? `${step.color} border-white shadow-sm`
                                : "bg-gray-50 border-gray-200 text-gray-300"
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                <h3 className={`font-semibold ${step.completed ? "text-gray-900" : "text-gray-400"}`}>
                                    {step.label}
                                </h3>
                                {step.date && (
                                    <span className="text-xs text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded-full border">
                                        {format(new Date(step.date), "PPp")}
                                    </span>
                                )}
                            </div>
                            <p className={`text-sm mt-1 ${step.completed ? "text-gray-600" : "text-gray-400"}`}>
                                {step.description}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
