"use client";

import Footer from "@/components/Footer";
import { Space_Grotesk } from "next/font/google";
import { useState } from "react";
import RobloxIcon from "../../assets/icons/Roblox.svg";
import likes from "../../assets/icons/likeIcon.svg";
import views from "../../assets/icons/viewsEye.svg";
import Person from "../../assets/icons/personIcon.svg";
import enterArrow from "../../assets/icons/arrow-right.svg";
import Image from "next/image";
import Pagination from "@/components/pagination";
import Navbar from "@/components/Navbar";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

interface Tools {
  imageUrl: string;
  name: string;
}

interface Workflow {
  for: string;
  by: string;
  name: string;
  about: string;
  likes: number;
  views: number;
  tools: Tools[];
  createdAt: string;
}

const TABS: string[] = [
  "All",
  "Marketing",
  "Engineering",
  "Operations",
  "Creative",
  "Research",
];

const workflows: Workflow[] = [
  {
    for: "WRITER",
    by: "content_pro",
    name: "Automated LinkedIn Content Engine",
    about:
      "A seamless bridge to convert long-form YouTube transcripts into 5 unique LinkedIn posts using custom GPT prompts and scheduled via Typefully.",
    likes: 1525000,
    views: 1200,
    tools: [
      { imageUrl: RobloxIcon, name: "ChatGPT" },
      { imageUrl: RobloxIcon, name: "Framer" },
      { imageUrl: RobloxIcon, name: "LinkedIn" },
      { imageUrl: RobloxIcon, name: "Bolt" },
    ],
    createdAt: "2h",
  },
  {
    for: "WRITER",
    by: "content_pro",
    name: "Automated LinkedIn Content Engine",
    about:
      "A seamless bridge to convert long-form YouTube transcripts into 5 unique LinkedIn posts using custom GPT prompts and scheduled via Typefully.",
    likes: 1525000,
    views: 1200,
    tools: [
      { imageUrl: RobloxIcon, name: "ChatGPT" },
      { imageUrl: RobloxIcon, name: "Framer" },
      { imageUrl: RobloxIcon, name: "LinkedIn" },
      { imageUrl: RobloxIcon, name: "Bolt" },
    ],
    createdAt: "2h",
  },
  {
    for: "WRITER",
    by: "content_pro",
    name: "Automated LinkedIn Content Engine",
    about:
      "A seamless bridge to convert long-form YouTube transcripts into 5 unique LinkedIn posts using custom GPT prompts and scheduled via Typefully.",
    likes: 1525000,
    views: 1200,
    tools: [
      { imageUrl: RobloxIcon, name: "ChatGPT" },
      { imageUrl: RobloxIcon, name: "Framer" },
      { imageUrl: RobloxIcon, name: "LinkedIn" },
      { imageUrl: RobloxIcon, name: "Bolt" },
    ],
    createdAt: "2h",
  },
  {
    for: "WRITER",
    by: "content_pro",
    name: "Automated LinkedIn Content Engine",
    about:
      "A seamless bridge to convert long-form YouTube transcripts into 5 unique LinkedIn posts using custom GPT prompts and scheduled via Typefully.",
    likes: 1525000,
    views: 1200,
    tools: [
      { imageUrl: RobloxIcon, name: "ChatGPT" },
      { imageUrl: RobloxIcon, name: "Framer" },
      { imageUrl: RobloxIcon, name: "LinkedIn" },
      { imageUrl: RobloxIcon, name: "Bolt" },
    ],
    createdAt: "2h",
  },
  {
    for: "WRITER",
    by: "content_pro",
    name: "Automated LinkedIn Content Engine",
    about:
      "A seamless bridge to convert long-form YouTube transcripts into 5 unique LinkedIn posts using custom GPT prompts and scheduled via Typefully.",
    likes: 1525000,
    views: 1200,
    tools: [
      { imageUrl: RobloxIcon, name: "ChatGPT" },
      { imageUrl: RobloxIcon, name: "Framer" },
      { imageUrl: RobloxIcon, name: "LinkedIn" },
      { imageUrl: RobloxIcon, name: "Bolt" },
    ],
    createdAt: "2h",
  },
  {
    for: "WRITER",
    by: "content_pro",
    name: "Automated LinkedIn Content Engine",
    about:
      "A seamless bridge to convert long-form YouTube transcripts into 5 unique LinkedIn posts using custom GPT prompts and scheduled via Typefully.",
    likes: 1525000,
    views: 1200,
    tools: [
      { imageUrl: RobloxIcon, name: "ChatGPT" },
      { imageUrl: RobloxIcon, name: "Framer" },
      { imageUrl: RobloxIcon, name: "LinkedIn" },
      { imageUrl: RobloxIcon, name: "Bolt" },
      { imageUrl: RobloxIcon, name: "Bolt" },
    ],
    createdAt: "2h",
  },
];

const SORT_BY: string[] = ["Trending", "Newest", "Top Rated"];

export default function Explore() {
  const [currentTab, setCurrentTab] = useState("All");
  const [currentOrder, setCurrentOrder] = useState("Trending");

  return (
    <div className={`h-screen bg-background ${spaceGrotesk.variable}`}>
      <Navbar />
      <div className="p-4 lg:p-8">
        <h1 className="text-4xl font-bold text-white">Explore All Workflows</h1>
        <p className="font-normal text-lg text-[#94A3B8]">
          Find and share the ultimate AI tool stacks for modern digital work.
        </p>

        <div className="flex justify-center items-center flex-col py-8 gap-8">
          <div className="flex flex-col lg:flex-row items-start justify-start gap-2 lg:gap-0 lg:justify-between lg:items-center w-full border-b border-[#1E293B] pb-2">
            <div className="overflow-x-scroll w-full">
              <div className="flex gap-2">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    className={`py-1 lg:py-2 px-2 lg:px-4 font-bold text-xs lg:text-sm cursor-pointer ${tab === currentTab ? "border-b-2 border-[#0D93F2] text-white" : "text-[#64748B]"}`}
                    onClick={() => setCurrentTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between w-full lg:w-fit lg:gap-2 bg-[#182934] p-1 rounded-lg">
              {SORT_BY.map((sort) => (
                <button
                  key={sort}
                  className={`${currentOrder === sort ? "text-white bg-[#101B22]" : "text-[#90B2CB]"} font-semibold text-sm cursor-pointer rounded-md px-4 py-0.5 lg:py-1.5 text-nowrap`}
                  onClick={() => setCurrentOrder(sort)}
                >
                  {sort}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-10 w-full">
            {/* Card */}
            {workflows.map((workflow, i) => (
              <div
                key={i}
                className="flex flex-col lg:flex-row justify-between relative gap-6 p-5 border border-[#1E293B] rounded-xl "
              >
                <div className="flex flex-col gap-2">
                  <div className="gap-3 flex">
                    <p className="rounded-full bg-[#0D93F2]/10 px-2.5 py-0 text-xs text-[#0D93F2] font-bold place-content-center ">
                      {workflow.for}
                    </p>
                    <Image src={Person} alt="person icon" />
                    <p>
                      @{workflow.by} • {workflow.createdAt} ago
                    </p>
                  </div>
                  <h3 className="text-[#F1F5F9] text-xl font-bold cursor-pointer">
                    {workflow.name}
                  </h3>
                  <p className="text-sm font-normal text-[#94A3B8] max-w-3/4">
                    {workflow.about}
                  </p>
                </div>

                {/* Tools Extra */}
                <div className=" flex flex-row lg:flex-col items-end justify-between border-t lg:border-t-0 lg:border-l border-[#1E293B] w-full lg:w-35 pt-2 lg:pt-0">
                  <div className=" flex flex-row lg:flex-col justify-between gap-4 lg:gap-1">
                    <div className="flex gap-1.5 items-center cursor-pointer text-sm font-medium">
                      <Image src={views} className="w-4" alt="views" />{" "}
                      {workflow.views > 999999
                        ? `${(workflow.views / 1000000).toFixed(1)}M`
                        : workflow.views > 999
                          ? `${(workflow.views / 1000).toFixed(1)}K`
                          : workflow.views}
                    </div>
                    <div className="text-[#0D93F2] flex gap-1.5 items-center cursor-pointer text-sm font-bold">
                      <Image src={likes} className="w-4" alt="likes" />{" "}
                      {workflow.likes > 999999
                        ? `${(workflow.likes / 1000000).toFixed(1)}M`
                        : workflow.likes > 999
                          ? `${(workflow.likes / 1000).toFixed(1)}K`
                          : workflow.likes}
                    </div>
                  </div>

                  <span className="p-2 place-content-center bg-[#1E293B] hover:bg-transparent rounded-lg cursor-pointer">
                    <Image src={enterArrow} alt="selectArrow" />
                  </span>
                </div>
                <div className="absolute gap-2 flex items-center -bottom-9">
                  <div className="flex -gap-4 relative flex-2">
                    {workflow.tools.slice(0, 3).map((tool, i) => (
                      <div
                        key={`${tool.imageUrl}+${i}`}
                        className="p-2 bg-[#1E293B] rounded-lg border-l-2 border-background z-0"
                      >
                        <Image src={tool.imageUrl} alt="Tools Icons" />
                      </div>
                    ))}
                  </div>
                  <p>
                    {workflow.tools.length === 4 && workflow.tools.length > 3
                      ? `+${workflow.tools[3].name}`
                      : `+${workflow.tools.length - 3} more tools`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Pagination />
      </div>

      <Footer />
    </div>
  );
}
