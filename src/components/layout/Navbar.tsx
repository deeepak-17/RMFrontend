"use client";


import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { Search, MapPin, Bell } from "lucide-react";

export const Navbar = () => {
  const pathname = useLocation().pathname;
  const [searchParams, setSearchParams] = useSearchParams();

  // Don't show on landing page
  if (pathname === "/") return null;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    if (term) {
      const newParams = { ...Object.fromEntries(searchParams), search: term };
      setSearchParams(newParams);
    } else {
      const newParams = Object.fromEntries(searchParams);
      delete newParams.search;
      setSearchParams(newParams);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 px-4 py-3 md:px-8">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative w-10 h-10">
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/50a2a612-5acf-432e-95f7-7652884b81f4-toogoodtogo-com/assets/icons/eb37301e40a80bb500e31e5a939924c582ad7744-512x512-1.png"
              alt="ResQMeals"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold tracking-tight text-primary hidden sm:block">
            ResQMeals
          </span>
        </Link>

        <div className="flex-1 max-w-md mx-4 md:mx-8">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search for surplus food..."
              className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
              value={searchParams.get('search') || ''}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 text-gray-600 hover:text-primary transition-colors px-3 py-2 rounded-xl hover:bg-gray-50">
            <MapPin className="w-5 h-5" />
            <span className="text-sm font-semibold hidden lg:block">Coimbatore</span>
          </button>
          <button className="relative p-2 text-gray-600 hover:text-primary transition-colors rounded-xl hover:bg-gray-50">
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
