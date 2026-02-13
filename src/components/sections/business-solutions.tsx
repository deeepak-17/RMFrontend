import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const solutions = [
  {
    title: 'FOR RESTAURANTS & CANTEENS',
    description: "Turn your surplus food into impact. Post leftover meals from your kitchen and let nearby NGOs claim them. Earn sustainability credits and reduce your waste disposal costs.",
    linkText: 'Register as Donor',
    href: '/register',
  },
  {
    title: 'FOR NGOs & SHELTERS',
    description: 'Access fresh, quality meals for your community. Get notified when donors near you post available food. Claim, coordinate pickup, and serve those in need.',
    linkText: 'Register as NGO',
    href: '/register',
  },
  {
    title: 'FOR VOLUNTEERS',
    description: "Be the bridge between surplus and need. Pick up food from donors and deliver to NGOs. Every delivery makes a real difference in someone's life.",
    linkText: 'Join as Volunteer',
    href: '/register',
  },
];

export default function BusinessSolutions() {
  return (
    <section className="bg-[#FFFFFF] text-[#111827] py-[80px] md:py-[120px] px-6 lg:px-0">
      <div className="container mx-auto max-w-[1280px]">
        {/* Section Header */}
        <div className="mb-16 max-w-3xl">
          <h2 className="text-[40px] md:text-[48px] font-bold leading-[1.2] tracking-[-0.01em] mb-6 text-[#111827]">
            Join the Movement
          </h2>
          <p className="text-[18px] md:text-[20px] font-normal leading-relaxed text-[#5F6D6D]">
            Whether you have surplus food to share or communities to serve, ResQMeals connects you with the right people to make an impact.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="flex flex-col h-full group transition-all duration-300 p-6 rounded-2xl hover:bg-emerald-50"
            >
              <div className="flex flex-col flex-grow">
                {/* Title */}
                <h4 className="text-[14px] font-extrabold tracking-[0.1em] text-emerald-600 mb-6 uppercase">
                  {solution.title}
                </h4>

                {/* Description */}
                <p className="text-[18px] font-normal leading-[1.6] text-[#111827] mb-8 flex-grow">
                  {solution.description}
                </p>
              </div>

              {/* Link */}
              <Link
                to={solution.href}
                className="inline-flex items-center gap-2 group/link w-fit"
              >
                <span className="text-[16px] font-bold text-emerald-600 border-b-2 border-transparent group-hover/link:border-emerald-600 transition-colors duration-300">
                  {solution.linkText}
                </span>
                <ArrowRight
                  className="w-5 h-5 text-emerald-600 transition-transform duration-300 group-hover/link:translate-x-1"
                  strokeWidth={2.5}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}