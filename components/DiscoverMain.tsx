"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import bookmarkLogo from "../assets/icons/Bookmark.svg";
import bookmarkedLogo from "../assets/icons/Boorkmarked.svg";
import logoFlow from "../assets/icons/logoFlow.svg";
import star from "../assets/icons/Star.svg";
import starredIcon from "../assets/icons/Starred.svg";
import InsightIcon from "@/assets/icons/insightIcon.svg";
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

import { useDiscover } from "./DiscoverContext";

const tabUnderline = {
  inactive: { opacity: 0 },
  active: {
    opacity: 1,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
} as const;

interface Tool {
  id: number;
  name: string;
  image: string | null;
  description?: string;
  category?: string;
  bestUseCases?: string[];
  pricing?: { pricingTitle: string; price: number; per: string }[];
}

export default function DiscoverMain() {
  const { activeTab, setActiveTab, searchQuery, filters } = useDiscover();

  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Example placeholder for interaction states (would be per-tool in a real app)
  const [bookmarked, setBookmarked] = useState<Record<number, boolean>>({});
  const [starred, setStarred] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchTools = async () => {
      setLoading(true);
      setError(null);
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      
      try {
        const res = await fetch(`/api/tools`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        
        if (!res.ok) throw new Error("Failed to load tools");
        
        const data = await res.json();
        setTools(data.data || []);
      } catch (err) {
        console.error("[tools]", err);
        setError("Failed to load tools");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTools();
  }, [activeTab]); // In a real app, activeTab might change the query

  const toggleBookmark = (id: number) => {
    setBookmarked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleStar = (id: number) => {
    setStarred(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      // 1. Search Query
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchLower || 
        tool.name.toLowerCase().includes(searchLower) || 
        (tool.description?.toLowerCase().includes(searchLower) ?? false) ||
        (tool.category?.toLowerCase().includes(searchLower) ?? false);

      if (!matchesSearch) return false;

      // Quick combine for roles & tasks fuzzy matching
      const combinedText = [
        tool.description || "",
        tool.category || "",
        ...(tool.bestUseCases || [])
      ].join(" ").toLowerCase();

      // 2. Roles (If explicitly < 4 checked, do fuzzy match)
      if (filters.roles.length > 0 && filters.roles.length < 4) {
        const matchesRole = filters.roles.some(r => combinedText.includes(r.toLowerCase()));
        if (!matchesRole) return false;
      }

      // 3. Tasks (If explicitly < 4 checked, do fuzzy match)
      if (filters.tasks.length > 0 && filters.tasks.length < 4) {
        const matchesTask = filters.tasks.some(t => combinedText.includes(t.toLowerCase()));
        if (!matchesTask) return false;
      }

      // 4. Prices
      // 3 is all prices (Free, Paid, Trial). If < 3, check pricing logic.
      if (filters.prices.length > 0 && filters.prices.length < 3) {
        const matchesPrice = filters.prices.some(fp => {
          if (fp === "Free") {
            return !tool.pricing?.length || tool.pricing.some(p => p.price === 0 || p.per.toLowerCase() === "free");
          }
          if (fp === "Paid") {
            return tool.pricing?.some(p => p.price > 0);
          }
          if (fp === "Trial") {
            return tool.pricing?.some(p => p.pricingTitle.toLowerCase().includes("trial"));
          }
          return false;
        });
        if (!matchesPrice) return false;
      }

      return true;
    });
  }, [tools, searchQuery, filters]);

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
            Tools / <span className="text-white">All</span>
          </div>
          <div className="flex gap-3">
            <p>Sort By:</p>
            <select
              className="bg-[#162430] text-white rounded-lg px-2 py-1 appearance-none outline-none"
              defaultValue="Recommended"
            >
              <option value="Recommended">Recommended</option>
              <option value="Top Rated">Top Rated</option>
              <option value="Most Popular">Most Popular</option>
              <option value="Newest Arrivals">Newest Arrivals</option>
            </select>
          </div>
        </motion.div>

        <div className="overflow-y-scroll h-[calc(100vh-16.25em)]">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center p-20">
              <div className="w-8 h-8 border-4 border-t-[#0D93F2] border-r-[#0D93F2] border-b-[#0D93F2] border-l-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <p className="text-red-400 text-lg font-semibold">{error}</p>
              <button
                onClick={() => setActiveTab(activeTab)} // Retrigger effect
                className="mt-2 px-5 py-2 rounded-lg bg-[#0D93F2]/10 text-[#0D93F2] text-sm font-semibold hover:bg-[#0D93F2]/20 transition-colors duration-200"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredTools.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <p className="text-lg font-semibold text-[#F1F5F9]">No tools found</p>
              <p className="text-sm text-[#64748B]">Check back later!</p>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && filteredTools.length > 0 && (
            <motion.div
              className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6"
              key={activeTab} // re-triggers animation when tab changes
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredTools.map((tool) => (
                <motion.div
                  key={tool.id}
                  className="border-2 border-[#223949] rounded-2xl flex flex-col justify-between"
                  variants={card}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-5 flex flex-col gap-4 bg-primary/10 rounded-t-2xl flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden shrink-0 place-content-center bg-[#1E293B]">
                          {tool.image ? (
                            <Image src={tool.image} alt={tool.name} fill className="object-cover" />
                          ) : (
                            <Image src={InsightIcon} alt="Tool icon" className="w-6 h-6 object-cover mx-auto" />
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="font-bold text-lg">{tool.name}</p>
                          <p className="font-normal text-xs text-muted">
                            {tool.category || "General"}
                          </p>
                        </div>
                      </div>

                      <motion.button
                        type="button"
                        className="cursor-pointer"
                        onClick={() => toggleBookmark(tool.id)}
                        whileTap={{ scale: 0.92 }}
                        whileHover={{ scale: 1.03 }}
                        aria-label="Toggle bookmark"
                      >
                        <Image
                          src={bookmarked[tool.id] ? bookmarkedLogo : bookmarkLogo}
                          alt="Bookmark icon"
                        />
                      </motion.button>
                    </div>

                    <p className="text-sm leading-6 font-normal text-muted line-clamp-2">
                      {tool.description || `The best AI workflows to automate your tasks using ${tool.name}.`}
                    </p>

                    <div className="fill-[#101B22]/50 bg-[#101B22]/50 rounded-lg p-3 mt-auto">
                      <div className="flex items-center justify-between">
                        <p className="text-muted text-[10px] leading-3.5 font-bold">
                          TOP WORKFLOW
                        </p>
                        <Image src={logoFlow} alt="workflow icon" />
                      </div>
                      <p className="text-sm leading-6 font-bold text-white truncate max-w-full">
                        Idea ⇢{" "}
                        <span className="text-[#0D93F2] font-bold text-sm">
                          {tool.name}
                        </span>{" "}
                        ⇢ Solution
                      </p>
                    </div>
                  </div>

                  {/* actions */}
                  <div className="flex items-center justify-between bg-[#040c11] rounded-b-2xl p-5 shrink-0">
                    <div className="flex gap-2">
                      <motion.div
                        whileHover={{ rotate: 8 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Image
                          src={starred[tool.id] ? starredIcon : star}
                          className="cursor-pointer"
                          alt="favorite icon"
                          onClick={() => toggleStar(tool.id)}
                        />
                      </motion.div>
                      <p className="text-muted text-xs font-normal">
                        <span className="text-white text-sm font-bold">4.8k</span>{" "}
                        (1.2k)
                      </p>
                    </div>
                    <div className="gap-3 flex items-center">
                      <p className="text-xs font-medium text-muted">Trial Check</p>
                      <motion.button
                        className="border-[#223949] text-[#0D93F2] bg-primary/10 text-xs font-medium cursor-pointer px-3 py-1.5 rounded-lg"
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
          )}

          <Pagination page={1} setPage={() => {}} totalPages={1} />
        </div>
      </div>
    </motion.main>
  );
}
