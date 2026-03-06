import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin, Mail } from "lucide-react";

const links = {
  Platform: ["How it Works", "Find Donations", "Post Food", "Volunteer"],
  Company: ["About Us", "Mission", "Impact", "Blog"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

const socials = [
  { icon: Facebook, label: "Facebook" },
  { icon: Instagram, label: "Instagram" },
  { icon: Twitter, label: "Twitter" },
  { icon: Linkedin, label: "LinkedIn" },
  { icon: Mail, label: "Email" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-emerald-950 text-white">
      {/* Top border gradient */}
      <div className="h-px bg-gradient-to-r from-transparent via-emerald-700 to-transparent" />

      <div className="container mx-auto px-6 max-w-[1280px] pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/30">
                <span className="text-white font-black text-base tracking-tight">R</span>
              </div>
              <span className="text-white font-bold text-[17px] tracking-tight">ResQMeals</span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-6" style={{ margin: "0 0 24px" }}>
              Connecting surplus food with communities in need. Every meal rescued is a step toward a hunger-free, waste-free world.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {socials.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/8 hover:bg-orange-500 flex items-center justify-center text-white/50 hover:text-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-5">
                {section}
              </h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-white/60 hover:text-white text-sm transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © 2026 ResQMeals. All rights reserved.
          </p>
          <p className="text-white/30 text-xs">
            Made with ❤️ to fight food waste
          </p>
        </div>
      </div>
    </footer>
  );
}