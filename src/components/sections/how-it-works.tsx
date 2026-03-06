import { Link } from "react-router-dom";
import { Upload, Search, Truck, CheckCircle, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Post Surplus Food",
    desc: "Donors log surplus food with details like quantity, type, and pickup window. Takes less than 2 minutes.",
    iconBg: "icon-box-orange",
  },
  {
    number: "02",
    icon: Search,
    title: "NGOs Find & Claim",
    desc: "Nearby NGOs browse a live map, find available donations, and claim them with one tap.",
    iconBg: "icon-box-emerald",
  },
  {
    number: "03",
    icon: Truck,
    title: "Volunteer Pickup",
    desc: "A verified volunteer is assigned the delivery route — from donor to NGO — with navigation support.",
    iconBg: "icon-box-blue",
  },
  {
    number: "04",
    icon: CheckCircle,
    title: "Mission Complete",
    desc: "The NGO receives the food, the chain of custody is logged, and the donor earns green credits.",
    iconBg: "icon-box-teal",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-28 bg-white overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />

      <div className="container mx-auto px-6 max-w-[1280px]">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-bold uppercase tracking-widest">
            Simple Process
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            How ResQMeals Works
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto mt-2" style={{ margin: "8px auto 0" }}>
            Four steps from surplus food to a meal in someone's hands.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-[52px] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200 z-0" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="relative z-10 flex flex-col items-center text-center"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Number badge */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-200 flex items-center justify-center z-20 lg:relative lg:top-auto lg:left-auto lg:mb-4">
                  <span className="text-white text-xs font-black">{step.number}</span>
                </div>

                {/* Icon circle */}
                <div className={`${step.iconBg} w-[88px] h-[88px] mb-6 shadow-lg`}>
                  <Icon className="w-9 h-9 text-white" strokeWidth={1.5} />
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 w-full hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <h3 className="text-gray-900 font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed" style={{ margin: 0 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link
            to="/register"
            className="inline-flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all duration-300 hover:scale-105"
          >
            Start Saving Food Today
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}