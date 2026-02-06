
import { Image } from "@/components/ui/image";

/**
 * CTABanner Component
 * 
 * A high-impact call-to-action banner featuring a full-bleed background image
 * and bold mission-driven typography.
 * 
 * Heading: "JOIN OVER 180,000 BUSINESSES FIGHTING FOOD WASTE WITH US"
 * Theme: Dark (as specified in the parameters)
 */
const CTABanner = () => {
  // Asset link from provided <assets> tag
  const backgroundImage = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/50a2a612-5acf-432e-95f7-7652884b81f4-toogoodtogo-com/assets/images/c2bd0cf11024f15df0fd4ae5aeb8e390e7b52da6-2400x1200-13.jpg";

  return (
    <section className="relative w-full overflow-hidden bg-[#064E3B]">
      {/* Background Image Container */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={backgroundImage}
          alt="Businesses fighting food waste"
          fill
          priority
          className="object-cover object-center opacity-60"
          sizes="100vw"
        />
        {/* Dark overlay for text readability as per design instructions (hero-overlay) */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content Container */}
      <div className="container relative z-10 flex flex-col items-center justify-center min-h-[500px] md:min-h-[600px] text-center px-6 py-20">
        <div className="max-w-[1000px] space-y-8">
          {/* Main Heading */}
          <h2 className="text-white text-[32px] md:text-[48px] lg:text-[56px] font-extrabold leading-[1.1] tracking-[-0.02em] uppercase">
            JOIN OVER 180,000 BUSINESSES FIGHTING FOOD WASTE WITH US
          </h2>

          {/* CTA Buttons - Using pill-shape styling from design system */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#"
              className="group relative inline-flex items-center justify-center bg-[#F97316] hover:bg-[#EA580C] text-white font-cta px-10 py-5 rounded-full transition-all duration-300 ease-in-out min-w-[240px]"
            >
              <span className="relative z-10">BECOME A PARTNER</span>
              {/* Hover effect stroke as per visual_effects_treatments */}
              <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-white/20 transition-all duration-300" />
            </a>

            <a
              href="#"
              className="group relative inline-flex items-center justify-center bg-transparent border-2 border-white text-white font-cta px-10 py-[18px] rounded-full hover:bg-white hover:text-[#115E59] transition-all duration-300 ease-in-out min-w-[240px]"
            >
              LEARN MORE
            </a>
          </div>
        </div>
      </div>

      {/* Optional organic mask shape if needed for pixel perfection - 
          based on "some images use organic mask shapes" in art direction */}
      <div className="absolute bottom-[-2px] left-0 w-full h-12 bg-[#F3F4F6] clip-path-curve"
        style={{ clipPath: 'ellipse(70% 100% at 50% 100%)' }} />
    </section>
  );
};

export default CTABanner;