import React from 'react';
import Image from 'next/image';

/**
 * HowItWorks component clones the "How to use the app" section.
 * It features an alternating grid layout with circular lifestyle images.
 * Theme: Dark (as specified in the prompt, focusing on the dark background/high-contrast sections).
 * Style: Inter font, 120px section padding, Forests Green and Mission Orange accents.
 */

const steps = [
  {
    step: "Step one",
    title: "How to use the app",
    description: "Discover Surprise Bags available at stores and restaurants near you.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/50a2a612-5acf-432e-95f7-7652884b81f4-toogoodtogo-com/assets/images/d0114e13d7e48fcc4bde9f6285b951b0f21a4cf6-2027x1789-5.jpg",
    imageAlt: "Discover surplus food bags in the app",
  },
  {
    step: "Step two",
    title: "How to use the app",
    description: "Confirm your choice, reserve your food, and pay through the app.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/50a2a612-5acf-432e-95f7-7652884b81f4-toogoodtogo-com/assets/images/96c5d7e9377df5ed45a570e28d00daf19fd58eb3-1326x1326-7.jpg",
    imageAlt: "Confirm and pay for food bag",
  },
  {
    step: "Step three",
    title: "How to use the app",
    description: "Head to the shop at the specified pickup time, swipe the app, and enjoy your food.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/50a2a612-5acf-432e-95f7-7652884b81f4-toogoodtogo-com/assets/images/d0114e13d7e48fcc4bde9f6285b951b0f21a4cf6-2027x1789-8.jpg",
    imageAlt: "Collection process in store",
  },
  {
    step: "Step four",
    title: "How to use the app",
    description: "You've rescued good food from going to waste and done something good for the planet!",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/50a2a612-5acf-432e-95f7-7652884b81f4-toogoodtogo-com/assets/images/118bd1fc8cf8e36d803c6f9627d2181ed96850df-1128x1128-10.jpg",
    imageAlt: "Enjoying the rescued food",
  }
];

const HowItWorks = () => {
  return (
    <section className="bg-[#064E3B] text-white py-[120px] overflow-hidden">
      <div className="container mx-auto px-6 max-w-[1280px]">
        <div className="flex flex-col gap-[80px] md:gap-[120px]">
          {steps.map((item, index) => {
            const isEven = index % 2 !== 0;
            return (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Image Container */}
                <div className="w-full md:w-1/2 flex justify-center">
                  <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[480px] lg:h-[480px]">
                    <div className="absolute inset-0 rounded-full overflow-hidden border-[8px] border-[#115E59]">
                      <Image
                        src={item.image}
                        alt={item.imageAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 300px, 480px"
                      />
                    </div>
                    {/* Decorative element or circle outline - mimicking the "Impact Branding" soft shapes */}
                    <div className="absolute -z-10 -top-4 -left-4 w-full h-full rounded-full bg-white/5 blur-xl" />
                  </div>
                </div>

                {/* Text Content Container */}
                <div className="w-full md:w-1/2 text-center md:text-left">
                  <div className="mb-4">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-[#F97316] text-white font-cta uppercase tracking-wider text-xs mb-6">
                      {item.step}
                    </span>
                    <h2 className="text-[32px] md:text-[48px] font-bold leading-[1.2] tracking-tight mb-6">
                      <span className="block opacity-80 text-[20px] md:text-[24px] uppercase tracking-widest font-semibold mb-2">
                        {item.title}
                      </span>
                      {item.description}
                    </h2>
                  </div>
                  
                  {/* Action/Indicator for flow */}
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <div className="w-12 h-[2px] bg-[#F97316]" />
                    <span className="text-[#F97316] font-semibold text-lg">0{index + 1}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Area - Optional context from High Level Design */}
        <div className="mt-24 text-center">
            <button className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl">
               Get Started Now
            </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;