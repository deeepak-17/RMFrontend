import { Link } from "react-router-dom";
import { UtensilsCrossed, Heart, Bike, ArrowRight } from "lucide-react";

const solutions = [
  {
    icon: UtensilsCrossed,
    category: "For Restaurants & Canteens",
    iconColor: "text-orange-500",
    iconBg: "bg-orange-50",
    borderHover: "hover:border-orange-200",
    title: "Turn surplus into impact",
    desc: "Stop throwing away unsold meals. Post them in seconds and build a reputation as a community-first brand. Get tax documentation for every eligible donation.",
    link: "/register",
    linkColor: "text-orange-600 hover:text-orange-700",
  },
  {
    icon: Heart,
    category: "For NGOs & Shelters",
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    borderHover: "hover:border-emerald-200",
    title: "Find food before it expires",
    desc: "Browse a live map of nearby donations, claim the right ones for your beneficiaries, and track the full chain of custody — all in one place.",
    link: "/register",
    linkColor: "text-emerald-600 hover:text-emerald-700",
  },
  {
    icon: Bike,
    category: "For Volunteers",
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    borderHover: "hover:border-blue-200",
    title: "Be the last mile of kindness",
    desc: "Accept tasks on your own schedule, get turn-by-turn navigation, and see the direct impact of every delivery you complete.",
    link: "/register",
    linkColor: "text-blue-600 hover:text-blue-700",
  },
];

export default function BusinessSolutions() {
  return (
    <section className="relative py-28 bg-gray-50 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      <div className="container mx-auto px-6 max-w-[1280px]">
        {/* Header */}
        <div className="mb-16 max-w-xl">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest">
            Join the Movement
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            Built for every
            <br />
            <span className="text-gradient-green">role in the chain</span>
          </h2>
          <p className="text-gray-500 text-lg" style={{ margin: 0 }}>
            Whether you're giving, receiving, or delivering — ResQMeals has a tailored experience for you.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {solutions.map((sol) => {
            const Icon = sol.icon;
            return (
              <div
                key={sol.category}
                className={`group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 ${sol.borderHover} transition-all duration-300 cursor-default`}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${sol.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-7 h-7 ${sol.iconColor}`} strokeWidth={1.5} />
                </div>

                {/* Category badge */}
                <span className="inline-block mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
                  {sol.category}
                </span>

                <h3 className="text-gray-900 text-xl font-bold mb-3">{sol.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6" style={{ margin: "0 0 24px" }}>
                  {sol.desc}
                </p>

                <Link
                  to={sol.link}
                  className={`inline-flex items-center gap-2 text-sm font-bold ${sol.linkColor} transition-colors group/link`}
                >
                  Get started
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}