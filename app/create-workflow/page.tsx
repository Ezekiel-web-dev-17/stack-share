"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useState } from "react";
import InfoIcon from "@/assets/icons/InfoIconSvg.svg";
import ArrowIcon from "@/assets/icons/arrow-icon.svg";
import TIpIcon from "@/assets/icons/tipIcon.svg";
import PreviewBackground from "@/assets/icons/PreviewBackground.svg";
import TwinkleStarImage from "@/assets/icons/TwinkleStarImage.svg";
import InsightIcon from "@/assets/icons/insightIcon.svg";
import MissionIcon from "@/assets/icons/targeticon.svg";
import ToolStackIcon from "@/assets/icons/ToolStackIcon.svg";
import CloseIcon from "@/assets/icons/close-icon.svg";
import SearchIcon from "@/assets/icons/SearchTool.svg";
import StoppedIcon from "@/assets/icons/StoppedIcon.svg";
import StepByStepIcon from "@/assets/icons/stepbystep.svg";
import AddStepIcon from "@/assets/icons/AddStepIcon.svg";
import DeleteIcon from "@/assets/icons/DeleteIcon.svg";
import { Space_Grotesk } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const, delay },
  }),
} as const;

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
} as const;

const stepListVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
} as const;

const stepCardVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
} as const;

const previewVariants = {
  hidden: { opacity: 0, x: 24 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: { opacity: 0, x: 24, transition: { duration: 0.2 } },
} as const;

export default function CreateWorkflow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [rotate, setRotate] = useState(false);
  const [steps, setSteps] = useState<number>(1);
  const [preview, setPreview] = useState<boolean>(false);
  const [outcomeFile, setOutcomeFile] = useState<string>("");

  return (
    <div className={`h-screen bg-background ${spaceGrotesk.variable}`}>
      <Navbar />
      <div className="flex gap-10 py-8 px-16 w-full lg:flex-row flex-col">
        <main className="flex flex-col gap-8 w-full">
          {/* Page Header */}
          <motion.header
            className="flex flex-col gap-2"
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="show"
          >
            <h1 className="text-4xl font-bold">Create Workflow</h1>
            <p className="text-[#90B2CB] font-normal text-base">
              Document your AI stack and process to help others automate their
              work.
            </p>
          </motion.header>

          {/* Creation Progress */}
          <motion.section
            aria-label="Creation progress"
            className="p-4 flex flex-col gap-2 bg-[#182934] rounded-xl border border-[#315168]"
            variants={fadeUp}
            custom={0.07}
            initial="hidden"
            animate="show"
          >
            <div className="flex justify-between items-center">
              <p className="font-medium text-sm">Creation Progress</p>
              <p className="text-sm font-bold text-[#0D93F2]">
                Step {currentStep} of 5: The Mission
              </p>
            </div>
            <input
              type="range"
              className="w-full h-2 accent-[#0D93F2] hover:cursor-pointer"
              min="0"
              max="5"
              value={currentStep}
              onChange={(e) => setCurrentStep(Number(e.target.value))}
            />
          </motion.section>

          {/* Form */}
          <form action="POST" className="flex flex-col gap-10 pt-2">
            {/* The Basics */}
            <motion.section
              className="flex flex-col gap-6"
              variants={sectionVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
            >
              <h2 className="text-xl font-bold text-[#0D93F2] flex items-center gap-2">
                <Image src={InfoIcon} alt="info icon" />
                The Basics
              </h2>
              <div className="flex flex-col lg:flex-row justify-between items-center lg:gap-24 gap-4">
                <div className="flex flex-col items-start gap-2 w-full">
                  <label
                    htmlFor="workflow-title"
                    className="font-medium text-sm"
                  >
                    Workflow Title
                  </label>
                  <input
                    type="text"
                    id="workflow-title"
                    name="workflow-title"
                    placeholder="e.g. Automated Content Research"
                    className="px-4 pb-3.5 pt-3.25 bg-[#182934] border border-[#315168] rounded-lg w-full focus:outline-0 focus:border-[#0D93F2]/60 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2 items-start w-full">
                  <label
                    htmlFor="professional-role"
                    className="font-medium text-sm"
                  >
                    Professional Role
                  </label>
                  <div
                    className="relative w-full"
                    onClick={() => setRotate(!rotate)}
                  >
                    <select
                      name="professional-role"
                      id="professional-role"
                      className="appearance-none px-4 pb-3.5 pt-3.25 bg-[#182934] border border-[#315168] rounded-lg w-full pr-10 focus:outline-0 focus:border-[#0D93F2]/60 transition-colors"
                    >
                      <option value="">Select professional role</option>
                      <option value="developer">Developer</option>
                      <option value="designer">Designer</option>
                      <option value="marketer">Marketer</option>
                      <option value="other">Other</option>
                    </select>
                    <Image
                      src={ArrowIcon}
                      alt="dropdown arrow"
                      className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-300 ${rotate ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>
              </div>
            </motion.section>

            {/* The Mission */}
            <motion.section
              className="flex flex-col gap-6"
              variants={sectionVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
            >
              <h2 className="text-xl font-bold text-[#0D93F2] flex items-center gap-2">
                <Image src={MissionIcon} alt="mission icon" />
                The Mission
              </h2>
              <div className="flex flex-col justify-start gap-2">
                <label htmlFor="primary-goal" className="font-medium text-sm">
                  Primary Goal
                </label>
                <textarea
                  name="primary-goal"
                  id="primary-goal"
                  placeholder="Describe the outcome of this workflow..."
                  className="px-4 py-3.5 bg-[#182934] border border-[#315168] rounded-lg w-full focus:outline-0 focus:border-[#0D93F2]/60 transition-colors max-h-24"
                ></textarea>
              </div>
            </motion.section>

            {/* The Tools Stack */}
            <motion.section
              className="flex flex-col gap-6"
              variants={sectionVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
            >
              <h2 className="text-xl font-bold text-[#0D93F2] flex items-center gap-2">
                <Image src={ToolStackIcon} alt="Tools Stack icon" />
                The Tools Stack
              </h2>
              <div className="flex flex-col gap-4 relative">
                <Image
                  src={SearchIcon}
                  alt="search icon"
                  className="absolute left-5 top-5 cursor-pointer w-4.5 h-4.5"
                />
                <input
                  type="search"
                  id="tool-search"
                  placeholder="Search and add tools (e.g. ChatGPT, Notion, Zapier...)"
                  className="pl-12 pr-4 py-3.5 bg-[#182934] border border-[#315168] rounded-lg w-full focus:outline-0 focus:border-[#0D93F2]/60 transition-colors"
                />
                <div
                  className="flex gap-2"
                  role="list"
                  aria-label="Selected tools"
                >
                  {["ChatGPT", "Calude 3.5", "Zapier"].map((tool) => (
                    <motion.button
                      key={tool}
                      type="button"
                      role="listitem"
                      className="flex gap-2 px-3 py-1.5 bg-[#0D93F2]/20 border border-[#0D93F2]/40 rounded-full items-center justify-center"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <Image
                        src={InsightIcon}
                        alt="insight icon"
                        className="w-4 h-4 hidden lg:block"
                      />
                      <span className="font-normal text-sm">{tool}</span>
                      <Image
                        src={CloseIcon}
                        alt={`Remove ${tool}`}
                        className="w-3 h-3 cursor-pointer"
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* The Step by Step Workflow */}
            <motion.section
              className="flex flex-col gap-6"
              variants={sectionVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
            >
              <div className="flex justify-between">
                <h2 className="text-xl font-bold text-[#0D93F2] flex items-center gap-2">
                  <Image src={StepByStepIcon} alt="Step by Step icon" />
                  The Step by Step Workflow
                </h2>
                <motion.button
                  type="button"
                  className="flex gap-1 cursor-pointer items-center justify-center"
                  onClick={() => setSteps(steps + 1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image src={AddStepIcon} alt="Add Step icon" />
                  <span className="text-sm font-bold text-[#0D93F2]">
                    Add Step
                  </span>
                </motion.button>
              </div>

              <motion.ol
                className="flex flex-col gap-4 list-none p-0 m-0"
                variants={stepListVariants}
                initial="hidden"
                animate="show"
              >
                <AnimatePresence>
                  {Array.from({ length: steps }).map((_, index) => (
                    <motion.li
                      key={index}
                      variants={stepCardVariants}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      layout
                    >
                      <fieldset className="border border-[#315168] p-6 ps-10 bg-[#182934] rounded-xl relative w-full hover:border-[#0D93F2]/40 transition-colors">
                        <legend className="sr-only">Step {index + 1}</legend>
                        <div className="bg-[#0D93F2] p-0.5 px-2 text-white font-bold text-sm rounded-full w-fit absolute left-0 top-4">
                          {index + 1}
                        </div>
                        <motion.button
                          type="button"
                          className="absolute right-2 top-2 cursor-pointer"
                          aria-label={`Delete step ${index + 1}`}
                          onClick={() => {
                            steps > 1 ? setSteps(steps - 1) : setSteps(1);
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Image src={DeleteIcon} alt="" aria-hidden="true" />
                        </motion.button>
                        <div className="flex flex-col gap-4">
                          <label className="flex flex-col gap-1.5">
                            <span className="sr-only">
                              Step {index + 1} title
                            </span>
                            <input
                              type="text"
                              placeholder={`${index === 0 ? "First" : "Next"} Step Title`}
                              className="px-3 py-1.5 bg-[#182934] border border-[#315168] rounded-lg w-full focus:outline-0 focus:border-[#0D93F2]/60 transition-colors"
                            />
                          </label>
                          <label className="flex flex-col gap-1.5">
                            <span className="sr-only">
                              Step {index + 1} description
                            </span>
                            <textarea
                              placeholder="Describe what happens in this step..."
                              className="px-3 py-1.5 bg-[#182934] border border-[#315168] rounded-lg w-full focus:outline-0 focus:border-[#0D93F2]/60 transition-colors text-white"
                            />
                          </label>
                          <label className="flex flex-col gap-1.5">
                            <span className="sr-only">
                              Example prompt for step {index + 1}
                            </span>
                            <textarea
                              placeholder="e.g. 'Summarize this article in 3 bullet points for a non-technical audience'"
                              className="px-3 py-1.5 bg-[#182934] border border-[#315168] rounded-lg w-full focus:outline-0 focus:border-[#0D93F2]/60 transition-colors text-white"
                            />
                          </label>
                        </div>
                      </fieldset>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ol>
            </motion.section>

            {/* The Unique Insight */}
            <motion.section
              className="flex flex-col gap-6"
              variants={sectionVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
            >
              <h2 className="text-xl font-bold text-[#0D93F2] flex items-center gap-2">
                <Image src={ToolStackIcon} alt="Insight icon" />
                The Unique Insight
              </h2>
              <div className="border border-[#0D93F2]/20 bg-[#0D93F2]/5 p-6 rounded-xl flex flex-col gap-4">
                <div className="flex gap-2 items-center">
                  <Image src={StoppedIcon} alt="" aria-hidden="true" />
                  <p className="text-sm font-bold text-[#0D93F2]">
                    One Thing You Stopped Using
                  </p>
                </div>
                <label htmlFor="stopped" className="sr-only">
                  What did this workflow replace?
                </label>
                <textarea
                  name="stopped"
                  id="stopped"
                  placeholder="What tool or manual process did this workflow replace?"
                  className="px-4 py-3 border border-[#0D93F2]/30 bg-[#101B22] rounded-lg w-full focus:outline-0 focus:border-[#0D93F2]/60 transition-colors max-h-18.5 placeholder:text-[#6B7280]"
                ></textarea>
              </div>
            </motion.section>

            {/* Outcome File */}
            <motion.section
              className="flex flex-col gap-3"
              variants={sectionVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
            >
              <div className="flex flex-col gap-1">
                <p className="text-xl font-bold text-[#0D93F2] flex items-center gap-2">
                  Outcome File{" "}
                  <span className="text-[#315168] font-normal text-sm">
                    (optional)
                  </span>
                </p>
                <p className="text-sm text-[#90B2CB]">
                  Upload a sample output, screenshot, or result that shows what
                  this workflow produces.
                </p>
              </div>
              <motion.label
                className="flex items-center gap-3 px-4 py-3 bg-[#182934] border border-dashed border-[#315168] rounded-lg w-full cursor-pointer group transition-colors"
                whileHover={{ borderColor: "rgba(13,147,242,0.5)" }}
                transition={{ duration: 0.2 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-[#90B2CB] group-hover:text-[#0D93F2] transition-colors shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span className="text-sm text-[#90B2CB] group-hover:text-white transition-colors">
                  Upload a sample output, screenshot or result file
                </span>
                <input
                  type="file"
                  accept="image/*,.pdf,.txt,.csv,.json,.md"
                  className="hidden"
                  value={outcomeFile}
                  onChange={(e) => setOutcomeFile(e.target.value)}
                />
              </motion.label>
            </motion.section>

            {/* Submit & Preview */}
            <motion.div
              className="flex gap-4 w-full pt-10"
              variants={fadeUp}
              custom={0}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <motion.button
                type="submit"
                className="w-full bg-[#0D93F2] text-white py-4 font-bold text-base rounded-xl cursor-pointer border-2 border-[#0D93F2] transition-colors hover:bg-transparent hover:text-[#0D93F2]"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                Publish Workflow
              </motion.button>
              <motion.button
                type="button"
                className="px-8 py-3.5 text-nowrap rounded-xl bg-[#182934] border border-[#315168] font-bold text-white text-base cursor-pointer hover:bg-[#0D93F2] hover:border-[#0D93F2] transition-colors"
                onClick={() => setPreview(!preview)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {preview ? "Hide Preview" : "Preview Full Page"}
              </motion.button>
            </motion.div>
          </form>
        </main>

        {/* Live Preview Panel */}
        <AnimatePresence>
          {preview && (
            <motion.aside
              className="flex flex-col gap-6 min-w-1/4"
              variants={previewVariants}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              <div className="flex justify-between items-center">
                <p className="font-medium text-sm text-[#90B2CB]">
                  LIVE PREVIEW
                </p>
                <p className="text-[10px] font-bold text-[#0D93F2] flex items-center gap-1">
                  <span className="w-2 h-2 bg-accent-green rounded-full"></span>
                  SYNCING
                </p>
              </div>

              {/* Preview Card */}
              <div>
                <div className="relative rounded-t-2xl overflow-hidden">
                  <Image
                    src={PreviewBackground}
                    alt="Preview card background"
                    className="w-full h-full"
                  />
                  <Image
                    src={TwinkleStarImage}
                    alt=""
                    aria-hidden="true"
                    className="absolute top-1/3 left-1/2 -translate-x-1/2"
                  />
                </div>
                <div className="px-6 py-5.75 flex flex-col gap-4 bg-[#182934] rounded-b-2xl border border-[#315168] items-start">
                  <div className="flex flex-col gap-1.75">
                    <span className="text-[#0D93F2] text-[10px] bg-[#0D93F2]/10 px-2 py-px font-bold rounded-sm w-fit">
                      {"PRODUCT MANAGER"}
                    </span>
                    <h2 className="text-xl font-bold">
                      Automated Content Research
                    </h2>
                  </div>
                  <p className="text-sm text-[#90B2CB] max-w-87.5">
                    Describe the outcome of this workflow... use the &apos;Deep
                    Analysis&apos; prompt in Claude to break down and analyze
                    the content.
                  </p>

                  {/* Tools */}
                  <div className="py-2 px-0 flex items-center gap-2 justify-center">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="p-2 bg-[#1E293B] rounded-lg">
                        <Image src={InsightIcon} alt="Tool icon" />
                      </div>
                    ))}
                    <p className="text-sm text-[#90B2CB]">+2 more</p>
                  </div>

                  {/* Process Preview */}
                  <div className="pt-4 flex flex-col gap-3 w-full">
                    <div className="flex justify-between w-full">
                      <p className="font-medium text-xs text-[#90B2CB]">
                        PROCESS PREVIEW
                      </p>
                      <p className="text-xs text-[#90B2CB]">3 Steps</p>
                    </div>
                    <ol className="flex flex-col gap-3 list-none p-0 m-0">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <li key={index} className="flex gap-3 items-center">
                          <div className="w-6 h-6 place-content-center bg-[#0D93F2]/10 rounded-full px-2">
                            <p className="font-bold text-xs text-[#0D93F2]">
                              {index + 1}
                            </p>
                          </div>
                          <div className="w-full py-1.5 bg-[#315168] rounded-lg h-fit"></div>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Insight Preview */}
                  <div className="bg-[#101B22]/50 p-3 flex flex-col gap-1 w-full">
                    <p className="font-medium text-xs text-[#0D93F2]">
                      INSIGHT PREVIEW
                    </p>
                    <p className="text-sm text-[#90B2CB]">
                      &quot;I stopped using manual Google Sheets tracking for
                      initial drafts...&quot;
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Tip */}
              <aside className="p-4 flex justify-start items-start gap-3 bg-[#182934] rounded-xl border border-[#315168]">
                <Image src={TIpIcon} alt="tip icon" />
                <div className="flex flex-col gap-1">
                  <p className="font-bold text-sm">Quick Tip</p>
                  <p className="text-sm text-[#90B2CB]">
                    Workflows with clear tool connections get 3x more views from
                    the community.
                  </p>
                </div>
              </aside>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}
