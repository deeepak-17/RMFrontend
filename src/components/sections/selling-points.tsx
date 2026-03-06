import { Utensils, MapPin, Leaf, Heart } from "lucide-react";

const points = [
  {
    icon: Utensils,
    color: "text-orange-400",
    bg: "bg-orange-500/15 border-orange-400/20",
    title: "Rescue Surplus Food",
    desc: "Post surplus food from your restaurant, canteen, or event in under 2 minutes.",
  },
  {
    icon: MapPin,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15 border-emerald-400/20",
    title: "Find Food Nearby",
    desc: "NGOs see real-time donations on a map and can claim them instantly.",
  },
  {
    icon: Leaf,
    color: "text-teal-400",
    bg: "bg-teal-500/15 border-teal-400/20",
    title: "Reduce Carbon Footprint",
    desc: "Every meal rescued prevents CO₂ from food decomposing in landfills.",
  },
  {
    icon: Heart,
    color: "text-pink-400",
    bg: "bg-pink-500/15 border-pink-400/20",
    title: "Feed Communities",
    desc: "Volunteers bridge the last mile, ensuring food reaches those who need it.",
  },
];

export default function SellingPoints() {
  return (
    <section className="relative py-28 bg-gradient-to-b from-emerald-950 to-emerald-900 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 container mx-auto px-6 max-w-[1280px]">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-orange-500/15 border border-orange-400/20 text-orange-300 text-xs font-bold uppercase tracking-widest">
            Why use
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            RESQMEALS
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((point, i) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className="group glass-dark rounded-2xl p-8 flex flex-col items-center text-center hover:bg-white/10 hover:-translate-y-2 transition-all duration-300 cursor-default border border-white/10 hover:border-white/20"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className={`w-20 h-20 rounded-2xl ${point.bg} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`w-9 h-9 ${point.color}`} strokeWidth={1.5} />
                </div>
                <h3 className="text-white text-lg font-bold mb-3 tracking-tight">
                  {point.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed" style={{ margin: 0 }}>
                  {point.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}