"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeInDown } from "@/lib/animations";
import Image from "next/image";
import Logo from "../assets/icons/logo.svg";
import Link from "next/link";

const NAV_LINKS = ["Discover", "Community", "Newsletter", "Explore"];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            <Image src={Logo} alt="Logo" width={32} height={32} />
            <span className="text-lg font-bold text-white">StackShare</span>
          </div>
          {/* Links */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href={link === "Discover" ? "/discover" : "#"}
                className="text-sm text-muted transition-colors hover:text-white"
              >
                {link}
              </a>
            ))}
          </div>
          {/* Actions */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="hidden text-sm text-muted transition-colors hover:text-white sm:block"
            >
              Login
            </a>
            <Link href="/create-workflow">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-lg bg-primar px-4 py-2 bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-dark cursor-pointer"
              >
                Submit Stack
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.nav>
    </header>
  );
};

export default Navbar;
