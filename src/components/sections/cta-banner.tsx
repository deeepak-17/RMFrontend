import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const stats = [
  { value: "10K+", label: "Meals Saved" },
  { value: "5T+", label: "CO₂ Prevented" },
  { value: "500+", label: "Partners" },
];

export default function CTABanner() {
  return (
    <section className="relative py-28 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-800 overflow-hidden">
      {/* Animated blobs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-orange-500/15 blur-3xl animate-float-slow pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-teal-500/15 blur-3xl animate-float pointer-events-none" />
      {/* Radial centre glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[200px] rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-[900px] text-center">
        {/* Stats row */}
        <div className="flex flex-wrap justify-center gap-4 mb-14">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-dark rounded-2xl px-7 py-5 text-center min-w-[130px]"
            >
              <p className="text-3xl font-extrabold text-orange-400 tracking-tight leading-none mb-1">
                {stat.value}
              </p>
              <p className="text-white/55 text-xs font-bold uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Headline */}
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
          Ready to Make a Difference?
        </h2>
        <p className="text-3xl md:text-4xl font-bold text-gradient-teal mb-6">
          Join ResQMeals Today
        </p>
        <p className="text-white/60 text-lg max-w-xl mx-auto mb-10" style={{ margin: "0 auto 40px" }}>
          Thousands of meals are wasted every day. Be part of the solution.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/register"
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-8 py-4 rounded-full shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white font-bold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-sm"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}