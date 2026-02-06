import { ClipboardList, MapPin, Truck, CheckCircle } from 'lucide-react';

const steps = [
  {
    step: "Step one",
    title: "Post Surplus Food",
    description: "Donors list their surplus food with photos, quantity, and pickup time. Our system validates food safety automatically.",
    icon: ClipboardList,
  },
  {
    step: "Step two",
    title: "NGOs Find & Claim",
    description: "Nearby NGOs and shelters receive notifications. They can view available donations on a map and claim what they need.",
    icon: MapPin,
  },
  {
    step: "Step three",
    title: "Volunteer Pickup",
    description: "Volunteers are assigned to pick up the food and deliver it to the claiming NGO within the safety window.",
    icon: Truck,
  },
  {
    step: "Step four",
    title: "Mission Complete",
    description: "Food reaches those in need. Donors earn green credits, and everyone contributes to reducing food waste!",
    icon: CheckCircle,
  }
];

const HowItWorks = () => {
  return (
    <section className="bg-white text-gray-900 py-[80px] md:py-[120px] overflow-hidden">
      <div className="container mx-auto px-6 max-w-[1280px]">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <p className="text-orange-500 mb-4 tracking-widest uppercase font-semibold">
            Simple Process
          </p>
          <h2 className="text-[40px] md:text-[48px] font-extrabold leading-tight tracking-tight">
            How ResQMeals Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative flex flex-col items-center text-center p-6"
              >
                {/* Step Number */}
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>

                {/* Icon Container */}
                <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                  <Icon className="w-10 h-10 text-emerald-600" strokeWidth={1.5} />
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>

                {/* Connector Line (not on last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 -right-4 w-8 h-0.5 bg-emerald-200" />
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <a
            href="/register"
            className="inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Start Saving Food Today
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;