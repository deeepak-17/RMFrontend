import { Link } from "react-router-dom";

const stats = [
  { value: "10K+", label: "Meals Rescued" },
  { value: "500+", label: "Partner Businesses" },
  { value: "50+", label: "NGOs Connected" },
];

export default function HeroSection() {
  return (
    <section className="relative flex flex-col min-h-screen overflow-hidden bg-[#0D4A2F]">

      {/* Decorative orbs — soft ambient accents, no animation */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Green orb — top-right, partially off screen */}
        <div
          className="absolute rounded-full"
          style={{
            top: "-6%",
            right: "-6%",
            width: "260px",
            height: "260px",
            background: "radial-gradient(circle at 40% 40%, #22c55e 0%, #16a34a 35%, transparent 72%)",
            filter: "blur(28px)",
            opacity: 0.50,
          }}
        />
        {/* Green orb — bottom-left, partially off screen */}
        <div
          className="absolute rounded-full"
          style={{
            bottom: "18%",
            left: "-8%",
            width: "220px",
            height: "220px",
            background: "radial-gradient(circle at 55% 55%, #22c55e 0%, #15803d 40%, transparent 72%)",
            filter: "blur(24px)",
            opacity: 0.45,
          }}
        />
        {/* Orange orb — bottom-right, fully inside viewport */}
        <div
          className="absolute rounded-full"
          style={{
            bottom: "22%",
            right: "4%",
            width: "200px",
            height: "200px",
            background: "radial-gradient(circle at 40% 40%, #fb923c 0%, #f97316 40%, transparent 72%)",
            filter: "blur(22px)",
            opacity: 0.55,
          }}
        />
      </div>

      {/* Main hero content */}
      <div className="relative z-10 flex flex-col flex-1 items-center justify-center text-center px-6 pt-28 pb-0">

        {/* Headline */}
        <h1 className="text-white font-extrabold leading-[1.1] tracking-tight mb-6 animate-fade-in-up"
          style={{ fontSize: "clamp(2.4rem, 8vw, 4.5rem)", animationDelay: "0ms" }}>
          Rescue Surplus Food,
          <br />
          <span className="text-orange-500">
            Feed Those in Need
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-white/65 leading-relaxed max-w-xs mx-auto mb-10 animate-fade-in-up"
          style={{ fontSize: "1rem", margin: "0 auto 40px", animationDelay: "100ms" }}
        >
          Connect restaurants, canteens, and events with NGOs and shelters. Reduce food waste while making a real impact in your community.
        </p>

        {/* CTA Buttons — stacked, full-width pill shaped */}
        <div
          className="w-full max-w-sm flex flex-col gap-3 mb-12 animate-fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          <Link
            to="/register"
            className="w-full flex items-center justify-center font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-full py-4 text-base shadow-lg shadow-orange-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Register
          </Link>
          <Link
            to="/login"
            className="w-full flex items-center justify-center font-bold text-white bg-transparent hover:bg-white/8 border-2 border-white/40 hover:border-white/60 rounded-full py-4 text-base transition-all duration-200 hover:scale-[1.01]"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Stats row — pinned to bottom portion */}
      <div className="relative z-10 w-full animate-fade-in-up" style={{ animationDelay: "300ms" }}>
        {/* Separator */}
        <div className="mx-6 h-px bg-white/10" />

        <div className="grid grid-cols-3 divide-x divide-white/10 py-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 px-4">
              <span
                className="font-extrabold text-orange-500 leading-none tracking-tight"
                style={{ fontSize: "clamp(1.6rem, 6vw, 2.2rem)" }}
              >
                {stat.value}
              </span>
              <span className="text-white/50 text-xs font-medium text-center leading-tight">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}