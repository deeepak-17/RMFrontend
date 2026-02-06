


const HeroSection = () => {
  return (
    <section className="relative w-full min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-[#064E3B]">
      {/* Background Video */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        data-v-97473711="" // Keeping the data attribute from computed styles perspective
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://static-mkt.toogoodtogo.com/video/web_hero_en_us_1080.mp4"
            type="video/mp4"
          />
        </video>
        {/* Hero Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10" />
      </div>

      {/* Content Container */}
      <div className="container relative z-20 flex flex-col items-center text-center px-6">
        <div className="max-w-[1000px] flex flex-col items-center">
          {/* Main Headline */}
          <h1
            className="text-white text-[48px] md:text-[64px] font-extrabold leading-[1.1] tracking-[-0.02em] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000"
            style={{
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            Save good food from going to waste
          </h1>

          {/* Tagline / Secondary headline mentioned in instructions */}
          <p className="text-white text-[18px] md:text-[22px] font-medium leading-[1.6] mb-10 max-w-2xl opacity-90">
            Save good food from going to waste. Our app is the world&apos;s largest marketplace for surplus food.
          </p>

          {/* App Store Badges (Placeholder behavior from High Level Design) */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <a
              href="#"
              className="inline-block transition-transform hover:scale-105 active:scale-95"
              aria-label="Download on the App Store"
            >
              <div className="bg-black/80 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-xl flex items-center gap-3">
                <svg className="w-8 h-8 text-white" viewBox="0 0 384 512" fill="currentColor">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                </svg>
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold leading-none m-0 p-0 mb-1">Download on the</p>
                  <p className="text-[18px] font-bold leading-none m-0 p-0">App Store</p>
                </div>
              </div>
            </a>
            <a
              href="#"
              className="inline-block transition-transform hover:scale-105 active:scale-95"
              aria-label="Get it on Google Play"
            >
              <div className="bg-black/80 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-xl flex items-center gap-3">
                <svg className="w-8 h-8 text-white" viewBox="0 0 512 512" fill="currentColor">
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l220.7-221.2 60.7 60.7L104.6 499z" />
                </svg>
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold leading-none m-0 p-0 mb-1">Get it on</p>
                  <p className="text-[18px] font-bold leading-none m-0 p-0">Google Play</p>
                </div>
              </div>
            </a>
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