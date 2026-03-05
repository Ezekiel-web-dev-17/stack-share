"use client";

import DiscoverAside from "@/components/DiscoverAside";
import DiscoverMain from "@/components/DiscoverMain";
import DiscoverNavbar from "@/components/DiscoverNavbar";
import { useState } from "react";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export default function Discover() {
  const [menuOpen, setMenuOpen] = useState(false);
  // const [searchMode, setSearchMode] = useState(false);

  return (
    <div
      className={`h-screen bg-background overflow-y-hidden ${spaceGrotesk.variable}`}
    >
      <DiscoverNavbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className="flex items-start w-full border-2 border-[#223949] relative">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className={`max-w-72 absolute top-0 w-2/3 min-h-[calc(100dvh+20px)] right-0  bg-background z-10 lg:hidden ${menuOpen ? "block" : "hidden"}`}
        >
          <DiscoverAside />
        </div>
        <div className="lg:block hidden">
          <DiscoverAside />
        </div>
        <DiscoverMain />
      </div>
    </div>
  );
}
