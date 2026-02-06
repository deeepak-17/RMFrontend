
import { Image } from "@/components/ui/image";

const sellingPoints = [
  {
    title: 'Enjoy good food at ½ price or less',
    icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/50a2a612-5acf-432e-95f7-7652884b81f4-toogoodtogo-com/assets/images/f74c9d01207109bf1c7a751d090ea38eae9cbc93-857x858-6.png',
    alt: 'Half price food illustration',
  },
  {
    title: 'Rescue food near you',
    icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/50a2a612-5acf-432e-95f7-7652884b81f4-toogoodtogo-com/assets/images/85e0e837f98f2515673fb6680b0104585e2cbedf-1326x1326-9.png',
    alt: 'Local food rescue illustration',
  },
  {
    title: 'Help the environment by reducing food waste',
    icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/50a2a612-5acf-432e-95f7-7652884b81f4-toogoodtogo-com/assets/images/127458cf0783446fb4ecdaa8f27fa0a743de7a22-1326x1326-11.png',
    alt: 'Environmental impact illustration',
  },
  {
    title: 'Try something new from local cafes, bakeries or restaurants',
    icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/50a2a612-5acf-432e-95f7-7652884b81f4-toogoodtogo-com/assets/images/1be1334344195cbbdd15c6a5ee2bfd5cf0f1bebd-848x847-12.png',
    alt: 'Try new things illustration',
  },
];

/**
 * SellingPoints component
 * Focuses on the "Why use RESQMEALS" grid section as per design instructions.
 * Theme: Dark (as per critical_theme_instruction, using background #064E3B for section wrapper or following global dark styles).
 */
export default function SellingPoints() {
  return (
    <section
      className="bg-[#064E3B] text-white section-padding"
      aria-labelledby="selling-points-title"
    >
      <div className="container">
        <div className="text-center mb-16 md:mb-24">
          <p className="font-nav text-[#F97316] mb-4 tracking-widest uppercase">
            Why use
          </p>
          <h2
            id="selling-points-title"
            className="text-[40px] md:text-[48px] font-extrabold leading-tight tracking-tight uppercase"
          >
            RESQMEALS
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {sellingPoints.map((point, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center cursor-default"
            >
              <div className="relative w-[180px] h-[180px] mb-8 transition-transform duration-300 ease-in-out group-hover:scale-105">
                <div className="absolute inset-0 bg-[#115E59]/20 rounded-full scale-110 -z-10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                <Image
                  src={point.icon}
                  alt={point.alt}
                  width={180}
                  height={180}
                  className="object-contain"
                  priority={index < 2}
                />
              </div>

              <h3 className="text-xl md:text-2xl font-bold leading-[1.3] px-4">
                {point.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}