"use client";

import Image from "next/image";
import { useState } from "react";
import bookmarkLogo from "../assets/icons/Bookmark.svg";
import bookmarkedLogo from "../assets/icons/Boorkmarked.svg";
import jasperLogo from "../assets/icons/JasperAI.svg";
import logoFlow from "../assets/icons/logoFlow.svg";
import star from "../assets/icons/Star.svg";
import starredIcon from "../assets/icons/Starred.svg";
import { AnimatePresence, motion } from "framer-motion";
import Pagination from "./pagination";

const tabs = [
  "New & NoteWorthy",
  "Editor's Pick",
  "Community Favorites",
  "Trending Now",
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
} as const;

const card = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
} as const;

const tabUnderline = {
  inactive: { opacity: 0 },
  active: {
    opacity: 1,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
} as const;

export default function DiscoverMain() {
  const [activeTab, setActiveTab] = useState("New & NoteWorthy");
  const [bookmarked, setBookmarked] = useState(false);
  const [starred, setStarred] = useState(false);

  return (
    <motion.main
      className="flex flex-col border-2 border-[#223949] w-full p-0"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Tabs */}
      <div className="px-3 sm:px-10 border-b-2 border-[#223949] overflow-hidden ">
        <div className="inner-container flex items-start justify-start gap-3 sm:gap-10 overflow-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative border-b-4 pt-4 pb-3 text-center text-[14px] font-bold cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "border-primary text-white"
                    : "border-transparent text-muted"
                }`}
              >
                {tab}

                {/* subtle animated underline/glow */}
                <AnimatePresence initial={false}>
                  {isActive ? (
                    <motion.span
                      key="underline"
                      variants={tabUnderline}
                      initial="inactive"
                      animate="active"
                      exit="inactive"
                      className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-primary"
                    />
                  ) : null}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-6 p-6 sm:p-10 ">
        {/* Header row */}
        <motion.div
          className="flex items-start justify-between flex-col sm:flex-row text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-[14px] text-normal">
            Tools / <span className="text-white">Design</span> / All
          </div>
          <div className="flex gap-3">
            <p>Sort By:</p>
            <select
              className="bg-[#162430] text-white rounded-lg px-2 py-1 appearance-none"
              defaultValue="Recommended"
            >
              <option value="Recommended">Recommended</option>
              <option value="Top Rated">Top Rated</option>
              <option value="Most Popular">Most Popular</option>
              <option value="Newest Arrivals">Newest Arrivals</option>
              <option value="Most Workflows">Most Workflows</option>
            </select>
          </div>
        </motion.div>

        <div className="overflow-y-scroll h-[calc(100vh-16.25em)]">
          {/* Grid (animated in) */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            key={activeTab} // re-triggers animation when tab changes
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* Featured card */}
            <motion.div
              className="border-2 border-[#223949] rounded-2xl"
              variants={card}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-5 flex flex-col gap-4 bg-primary/10 rounded-t-2xl">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Image src={jasperLogo} alt="AI icon" />
                    <div className="flex flex-col gap-2">
                      <p className="font-bold text-lg">Jasper</p>
                      <p className="font-normal text-xs text-muted">
                        Content Writing
                      </p>
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    className="cursor-pointer"
                    onClick={() => setBookmarked((v) => !v)}
                    whileTap={{ scale: 0.92 }}
                    whileHover={{ scale: 1.03 }}
                    aria-label="Toggle bookmark"
                  >
                    <Image
                      src={bookmarked ? bookmarkedLogo : bookmarkLogo}
                      alt="Bookmark icon"
                    />
                  </motion.button>
                </div>

                <p className="text-sm leading-6 font-normal text-muted">
                  Enterprise-grade AI content platform to help marketing and…
                </p>

                <div className="fill-[#101B22]/50 bg-[#101B22]/50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-muted text-[10px] leading-3.5 font-bold">
                      TOP WORKFLOW
                    </p>
                    <Image src={logoFlow} alt="workflow icon" />
                  </div>
                  <p className="text-sm leading-6 font-bold text-white">
                    Blog Idea ⇢{" "}
                    <span className="text-[#0D93F2] font-bold text-sm">
                      Jasper
                    </span>{" "}
                    ⇢ SEO post
                  </p>
                </div>
              </div>

              {/* price */}
              <div className="flex items-center justify-between bg-[#040c11] rounded-b-2xl p-5">
                <div className="flex gap-2">
                  <motion.div
                    whileHover={{ rotate: 8 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Image
                      src={starred ? starredIcon : star}
                      className="cursor-pointer"
                      alt="favorite icon"
                      onClick={() => setStarred(!starred)}
                    />
                  </motion.div>
                  <p className="text-muted text-xs font-normal">
                    <span className="text-white text-sm font-bold">4.8k</span>{" "}
                    (1.2k)
                  </p>
                </div>
                <div className="gap-3 flex items-center">
                  <p className="text-xs font-medium text-muted">Paid</p>
                  <motion.button
                    className="border-[#223949] text-[#0D93F2] bg-primary/10 text-xs font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Get Tool
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Featured card */}
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                className="border-2 border-[#223949] rounded-2xl"
                variants={card}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                key={i}
              >
                <div className="p-5 flex flex-col gap-4 bg-primary/10 rounded-t-2xl">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Image src={jasperLogo} alt="AI icon" />
                      <div className="flex flex-col gap-2">
                        <p className="font-bold text-lg">Jasper</p>
                        <p className="font-normal text-xs text-muted">
                          Content Writing
                        </p>
                      </div>
                    </div>

                    <motion.button
                      type="button"
                      className="cursor-pointer"
                      onClick={() => setBookmarked((v) => !v)}
                      whileTap={{ scale: 0.92 }}
                      whileHover={{ scale: 1.03 }}
                      aria-label="Toggle bookmark"
                    >
                      <Image
                        src={bookmarked ? bookmarkedLogo : bookmarkLogo}
                        alt="Bookmark icon"
                      />
                    </motion.button>
                  </div>

                  <p className="text-sm leading-6 font-normal text-muted">
                    Enterprise-grade AI content platform to help marketing and…
                  </p>

                  <div className="fill-[#101B22]/50 bg-[#101B22]/50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-muted text-[10px] leading-3.5 font-bold">
                        TOP WORKFLOW
                      </p>
                      <Image src={logoFlow} alt="workflow icon" />
                    </div>
                    <p className="text-sm leading-6 font-bold text-white">
                      Blog Idea ⇢{" "}
                      <span className="text-[#0D93F2] font-bold text-sm">
                        Jasper
                      </span>{" "}
                      ⇢ SEO post
                    </p>
                  </div>
                </div>

                {/* price */}
                <div className="flex items-center justify-between bg-[#040c11] rounded-b-2xl p-5">
                  <div className="flex gap-2">
                    <motion.div
                      whileHover={{ rotate: 8 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Image
                        src={starred ? starredIcon : star}
                        className="cursor-pointer"
                        alt="favorite icon"
                        onClick={() => setStarred(!starred)}
                      />
                    </motion.div>
                    <p className="text-muted text-xs font-normal">
                      <span className="text-white text-sm font-bold">4.8k</span>{" "}
                      (1.2k)
                    </p>
                  </div>
                  <div className="gap-3 flex items-center">
                    <p className="text-xs font-medium text-muted">Paid</p>
                    <motion.button
                      className="border-[#223949] text-[#0D93F2] bg-primary/10 text-xs font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Get Tool
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <Pagination />
        </div>
      </div>
    </motion.main>
  );
}
