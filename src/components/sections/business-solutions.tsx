import React from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * BusinessSolutions Component
 * Clones the "Our Business solutions" section with pixel-perfect accuracy.
 * Theme: Dark (as specified in the tag, though the UI itself is a light-themed section)
 * 
 * Note: Even though the theme is 'dark', based on the design instructions 
 * and high-level design, this specific section sits on a clean white 
 * background (#F3F4F6 or #FFFFFF) as part of the page's modular structure.
 */

const solutions = [
  {
    title: 'SURPRISE BAGS',
    description: "Unlock revenue from surplus food: Sell your unsold food in 'Surprise Bags' through the ResQMeals app, for users to come collect in-store at a pre-determined time.",
    linkText: 'Become a partner',
    href: '#',
  },
  {
    title: 'RESQMEALS PLATFORM',
    description: 'Your end-to-end surplus food management solution: Modular software that helps retailers seamlessly track, manage and redistribute surplus food.',
    linkText: 'Learn more',
    href: '#',
  },
  {
    title: 'DATE LABELING INITIATIVE',
    description: "Reduce waste in households: Join a coalition of the world's leading brands with our bespoke 'Look-Smell-Taste' label printed on billions of Best Before products.",
    linkText: 'Learn more',
    href: '#',
  },
];

export default function BusinessSolutions() {
  return (
    <section className="bg-[#FFFFFF] text-[#111827] section-padding px-6 lg:px-0">
      <div className="container mx-auto max-w-[1280px]">
        {/* Section Header */}
        <div className="mb-16 max-w-3xl">
          <h2 className="text-[48px] font-bold leading-[1.2] tracking-[-0.01em] mb-6 text-[#111827]">
            Our Business solutions
          </h2>
          <p className="text-[20px] font-normal leading-relaxed text-[#5F6D6D]">
            We offer a range of solutions to empower the world&apos;s leading food distributors to avoid good food from going to waste.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16">
          {solutions.map((solution, index) => (
            <div 
              key={index} 
              className="flex flex-col h-full group transition-all duration-300"
            >
              <div className="flex flex-col flex-grow">
                {/* Title */}
                <h4 className="text-[14px] font-extrabold tracking-[0.1em] text-[#111827] mb-6 uppercase">
                  {solution.title}
                </h4>
                
                {/* Description */}
                <p className="text-[18px] font-normal leading-[1.6] text-[#111827] mb-8 flex-grow">
                  {solution.description}
                </p>
              </div>

              {/* Link */}
              <a
                href={solution.href}
                className="inline-flex items-center gap-2 group/link w-fit"
              >
                <span className="text-[16px] font-bold text-[#115E59] border-b-2 border-transparent group-hover/link:border-[#115E59] transition-colors duration-300">
                  {solution.linkText}
                </span>
                <ArrowRight 
                  className="w-5 h-5 text-[#115E59] transition-transform duration-300 group-hover/link:translate-x-1" 
                  strokeWidth={2.5}
                />
              </a>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        /* Local overrides for section padding as defined in high_level_design */
        .section-padding {
          padding-top: 120px;
          padding-bottom: 120px;
        }
        @media (max-width: 768px) {
          .section-padding {
            padding-top: 80px;
            padding-bottom: 80px;
          }
        }
      `}</style>
    </section>
  );
}