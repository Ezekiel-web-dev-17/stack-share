"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeInDown } from "@/lib/animations";
import Image from "next/image";
import Logo from "../assets/icons/logo.svg";
import SearchTool from "../assets/icons/SearchTool.svg";
import SearchIcon from "../assets/icons/SearchIcon2.svg";
import HamburgerIcon from "../assets/icons/hamburgerIcon.svg";
import CloseIcon from "../assets/icons/close-icon.svg";
import { usePathname } from "next/navigation";
import Link from "next/link";

const NAV_LINKS = ["Discover", "Community", "Newsletter", "Explore"];

const Navbar = ({
  menuOpen,
  setMenuOpen,
}: {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pathname = usePathname();

  return (
    <header
      className={`sticky top-0 z-50 min-h-18.25 flex flex-col items-center justify-center ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <motion.nav
        variants={fadeInDown}
        initial="hidden"
        animate="visible"
        className="w-full max-w-7xl  px-6"
      >
        <div className="mx-auto flex  items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="cursor-pointer flex gap-3">
              {" "}
              <Image src={Logo} alt="Logo" width={32} height={32} />
              <span className="text-lg font-bold text-white">StackShare</span>
            </Link>
            {/* Links */}
            <div className="hidden items-center gap-8 md:flex ms-7">
              {NAV_LINKS.map((link) => (
                <a
                  key={link}
                  href={
                    link === "Discover"
                      ? "/discover"
                      : link === "Explore"
                        ? "/explore"
                        : "#"
                  }
                  className={`text-sm transition-colors ${pathname === `/${link.toLowerCase()}` ? "font-bold text-white" : "text-muted"}`}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
          {/* Actions */}
          <div className="items-center gap-4 hidden lg:flex">
            <input
              type="text"
              placeholder="Search tools..."
              className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-white transition-colors dark:bg-background-dark dark:text-white focus:outline-none min-w-xs ps-10"
            />
            <Image
              src={SearchTool}
              alt="Search tool"
              className="absolute top-7 ms-3 w-5 h-5 opacity-75 cursor-pointer"
            />

            <a
              href="#"
              className="hidden text-sm text-muted transition-colors hover:text-white sm:block"
            >
              Login
            </a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg bg-primar px-4 py-2 bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-dark cursor-pointer"
            >
              Submit Stack
            </motion.button>
          </div>

          <div className="flex gap-6 items-center justify-center lg:hidden">
            <Image
              className="w-8 p-2 rounded-lg bg-[#162430]"
              src={SearchIcon}
              onClick={() => setMenuOpen(true)}
              alt="search tool"
            />

            {menuOpen ? (
              <Image
                src={CloseIcon}
                className="w-8 p-2 rounded-lg bg-[#162430]"
                alt="close menu"
                onClick={() => setMenuOpen(!menuOpen)}
              />
            ) : (
              <Image
                src={HamburgerIcon}
                className="w-8 min-h-8 p-2 rounded-lg bg-[#162430]"
                alt="menu"
                onClick={() => setMenuOpen(!menuOpen)}
              />
            )}
          </div>
        </div>
      </motion.nav>
    </header>
  );
};

export default Navbar;
