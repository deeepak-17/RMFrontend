import React from 'react';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Globe, ChevronDown } from 'lucide-react';

/**
 * ResQMeals Footer Component
 * 
 * Replicates the multi-column footer with app download buttons, 
 * social icons, and language selector using the Forest Green (#064E3B) 
 * background and Mission Orange highlights (#F97316).
 */

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'The App', href: '#' },
      { label: 'How it works', href: '#' },
      { label: 'Surprise Bags', href: '#' },
      { label: 'Platform', href: '#' },
    ],
  },
  {
    title: 'Business Solutions',
    links: [
      { label: 'Sell your surplus', href: '#' },
      { label: 'Retailers', href: '#' },
      { label: 'Bakeries & Cafes', href: '#' },
      { label: 'Hotels', href: '#' },
      { label: 'Date Labeling', href: '#' },
    ],
  },
  {
    title: 'Impact',
    links: [
      { label: 'Our Mission', href: '#' },
      { label: 'Sustainability Report', href: '#' },
      { label: 'Food Waste Education', href: '#' },
      { label: 'Community', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press Room', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Policy',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'Terms & Conditions', href: '#' },
      { label: 'Legal Notice', href: '#' },
    ],
  },
];

const socialIcons = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

const Footer = () => {
  return (
    <footer className="w-full bg-[#064E3B] text-white pt-[60px] pb-12 lg:pt-[80px]">
      <div className="container mx-auto px-6 max-w-[1280px]">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-12 mb-16">
          {footerLinks.map((section) => (
            <div key={section.title} className="flex flex-col space-y-4">
              <h3 className="text-[14px] font-bold uppercase tracking-[0.05em] text-white/90">
                {section.title}
              </h3>
              <ul className="flex flex-col space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[16px] text-white/70 hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Download Column */}
          <div className="col-span-2 lg:col-span-1 flex flex-col space-y-6">
            <h3 className="text-[14px] font-bold uppercase tracking-[0.05em] text-white/90">
              Download
            </h3>
            <div className="flex flex-col space-y-3">
              <a 
                href="#" 
                className="hover:opacity-80 transition-opacity max-w-[140px]"
                aria-label="Download on the App Store"
              >
                <img 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/50a2a612-5acf-432e-95f7-7652884b81f4-toogoodtogo-com/assets/images/ceed6a2b4247d22d0e6f9425cad1d5c39af762fe-480x160-2.png" 
                  alt="App Store"
                  className="w-full h-auto object-contain"
                  width={140}
                  height={46}
                />
              </a>
              <a 
                href="#" 
                className="hover:opacity-80 transition-opacity max-w-[155px]"
                aria-label="Get it on Google Play"
              >
                <img 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/50a2a612-5acf-432e-95f7-7652884b81f4-toogoodtogo-com/assets/images/68072d9f747a9e089548846cecc588ef52bb624e-540x160-3.png" 
                  alt="Google Play"
                  className="w-full h-auto object-contain"
                  width={155}
                  height={46}
                />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section Divider */}
        <hr className="border-white/10 mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-8 lg:space-y-0 text-white/60">
          {/* Social Links & Language */}
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-10">
            {/* Social Icons */}
            <div className="flex items-center space-x-5">
              {socialIcons.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="hover:text-[#F97316] transition-colors duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={22} strokeWidth={2} />
                </a>
              ))}
            </div>

            {/* Language Selector */}
            <button className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors duration-300">
              <Globe size={18} />
              <span className="text-[14px] font-semibold tracking-wide uppercase">United Kingdom</span>
              <ChevronDown size={16} />
            </button>
          </div>

          {/* Copyright */}
          <div className="text-center lg:text-right">
            <p className="text-[14px] m-0">
              © {new Date().getFullYear()} ResQMeals. All rights reserved. 
              <span className="ml-2 block md:inline mt-2 md:mt-0">Fight food waste, save money, save the planet.</span>
            </p>
          </div>
        </div>
      </div>
      
      {/* Decorative Branding Line */}
      <div className="w-full h-1 bg-[#F97316] mt-12"></div>
    </footer>
  );
};

export default Footer;