import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-[#064E3B]">
      {/* Background Gradient */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900" />
        {/* Decorative circles */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content Container */}
      <div className="container relative z-20 flex flex-col items-center text-center px-6">
        <div className="max-w-[1000px] flex flex-col items-center">
          {/* Badge */}
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            🍽️ Fighting Food Waste, Feeding Communities
          </span>

          {/* Main Headline */}
          <h1
            className="text-white text-[42px] md:text-[64px] font-extrabold leading-[1.1] tracking-[-0.02em] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000"
            style={{
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            Rescue Surplus Food,
            <span className="text-orange-400"> Feed Those in Need</span>
          </h1>

          {/* Tagline */}
          <p className="text-white text-[18px] md:text-[22px] font-medium leading-[1.6] mb-10 max-w-2xl opacity-90">
            Connect restaurants, canteens, and events with NGOs and shelters.
            Reduce food waste while making a real impact in your community.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold px-8 py-4 rounded-full hover:bg-white/20 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 text-white">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-orange-400">10K+</p>
              <p className="text-sm opacity-70">Meals Rescued</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-orange-400">500+</p>
              <p className="text-sm opacity-70">Partner Businesses</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-orange-400">50+</p>
              <p className="text-sm opacity-70">NGOs Connected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Pill Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <div className="w-[30px] h-[50px] border-2 border-white/30 rounded-full flex justify-center p-2">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;