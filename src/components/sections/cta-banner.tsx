import { Link } from 'react-router-dom';

const CTABanner = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl" />

      {/* Content Container */}
      <div className="container relative z-10 flex flex-col items-center justify-center min-h-[400px] md:min-h-[500px] text-center px-6 py-20">
        <div className="max-w-[900px] space-y-8">
          {/* Impact Stats */}
          <div className="flex justify-center gap-8 md:gap-16 mb-8">
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-white">10K+</p>
              <p className="text-emerald-200 text-sm">Meals Saved</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-white">5T</p>
              <p className="text-emerald-200 text-sm">CO₂ Prevented</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-white">500+</p>
              <p className="text-emerald-200 text-sm">Partners</p>
            </div>
          </div>

          {/* Main Heading */}
          <h2 className="text-white text-[28px] md:text-[42px] lg:text-[48px] font-extrabold leading-[1.2] tracking-[-0.02em]">
            Ready to Make a Difference?
            <span className="block text-orange-400">Join ResQMeals Today</span>
          </h2>

          <p className="text-emerald-100 text-lg max-w-xl mx-auto">
            Every meal you rescue feeds someone in need and helps the planet. Start your impact journey now.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="group relative inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-5 rounded-full transition-all duration-300 ease-in-out min-w-[240px] shadow-xl"
            >
              Get Started Free
            </Link>

            <Link
              to="/login"
              className="group relative inline-flex items-center justify-center bg-transparent border-2 border-white text-white font-bold px-10 py-[18px] rounded-full hover:bg-white hover:text-emerald-700 transition-all duration-300 ease-in-out min-w-[240px]"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;