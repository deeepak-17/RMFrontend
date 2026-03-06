export default function MissionStatement() {
  return (
    <section className="relative w-full py-24 bg-gradient-to-br from-emerald-950 to-teal-900 border-t border-white/10 overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[300px] rounded-full bg-teal-400/8 blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-[900px] text-center">
        {/* Section label */}
        <span className="inline-block mb-5 px-4 py-1.5 rounded-full bg-teal-500/15 border border-teal-400/20 text-teal-300 text-xs font-bold uppercase tracking-widest">
          Our Mission
        </span>

        <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-gradient-teal">
          ResQMeals is on a mission to end food waste while feeding communities that need it most.
        </h2>

        <p
          className="text-white/70 text-xl leading-relaxed max-w-3xl mx-auto"
          style={{ margin: "0 auto" }}
        >
          We bridge the gap between surplus food and hunger — connecting restaurants, catering teams, and event organisers directly with NGOs, shelters, and volunteers who can put that food to good use.
        </p>
      </div>
    </section>
  );
}