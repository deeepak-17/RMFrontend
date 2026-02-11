import { Utensils, MapPin, Leaf, Heart } from 'lucide-react';

const sellingPoints = [
  {
    title: 'Rescue Surplus Food',
    description: 'Prevent perfectly good food from going to waste',
    icon: Utensils,
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/20',
  },
  {
    title: 'Find Food Nearby',
    description: 'Connect with donors in your area using geolocation',
    icon: MapPin,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/20',
  },
  {
    title: 'Reduce Carbon Footprint',
    description: 'Every meal saved prevents CO₂ emissions',
    icon: Leaf,
    color: 'text-teal-400',
    bgColor: 'bg-teal-400/20',
  },
  {
    title: 'Feed Communities',
    description: 'Help NGOs and shelters serve those in need',
    icon: Heart,
    color: 'text-pink-400',
    bgColor: 'bg-pink-400/20',
  },
];

export default function SellingPoints() {
  return (
    <section
      className="bg-[#064E3B] text-white section-padding py-[80px] md:py-[120px]"
      aria-labelledby="selling-points-title"
    >
      <div className="container mx-auto px-6 max-w-[1280px]">
        <div className="text-center mb-16 md:mb-24">
          <p className="font-nav text-[#F97316] mb-4 tracking-widest uppercase">
            Why use
          </p>
          <h2
            id="selling-points-title"
            className="text-[40px] md:text-[48px] font-extrabold leading-tight tracking-tight uppercase"
          >
            RESQMEALS
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {sellingPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={index}
                className="group flex flex-col items-center text-center cursor-default"
              >
                <div className={`relative w-[140px] h-[140px] mb-8 rounded-full ${point.bgColor} flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:scale-110`}>
                  <Icon className={`w-16 h-16 ${point.color}`} strokeWidth={1.5} />
                </div>

                <h3 className="text-xl md:text-2xl font-bold leading-[1.3] px-4 mb-2">
                  {point.title}
                </h3>
                <p className="text-white/70 text-sm px-4">
                  {point.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}