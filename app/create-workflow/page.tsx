"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
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

// ─── Animation variants ───────────────────────────────────────────────────────

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

// ─── Types ────────────────────────────────────────────────────────────────────

interface StepData {
  title: string;
  description: string;
  demoText: string;
}

type FormErrors = Partial<Record<string, string>>;

// ─── Available tools ──────────────────────────────────────────────────────────

const AVAILABLE_TOOLS = [
  "ChatGPT",
  "Claude",
  "Gemini",
  "Notion",
  "Zapier",
  "Make",
  "Airtable",
  "Slack",
  "Trello",
  "GitHub",
  "Figma",
  "Canva",
  "Midjourney",
  "Perplexity",
  "Cursor",
  "VS Code",
  "Google Sheets",
  "Typeform",
  "Loom",
  "HubSpot",
  "Webflow",
  "Google Analytics 4",
  "Google Tag Manager",
  "Google Ads",
  "Meta Ads Manager",
  "Looker Studio",
  "Google Scholar",
  "Semantic Scholar",
  "Zotero"
];

const PROFESSIONAL_ROLES = [
  "Developer",
  "Designer",
  "Marketer",
  "Product Manager",
  "Data Analyst",
  "Content Creator",
  "Operations",
  "Researcher",
  "Video Editor",
  "Sales",
  "Other",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function CreateWorkflow() {
  const router = useRouter();

  // Basic fields
  const [title, setTitle] = useState("");
  const [role, setRole] = useState("");
  
  // API Models
  const [apiTools, setApiTools] = useState<{name: string, image: string | null}[]>([]);
  
  // Fetch tools from API
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    fetch(`/api/tools`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load tools");
        return res.json();
      })
      .then((data) => {
        if (data && data.data) {
          setApiTools(data.data);
        }
      })
      .catch((err) => console.error("[tools]", err));
  }, []);
  const [setupTime, setSetupTime] = useState("");
  const [description, setDescription] = useState("");
  const [insight, setInsight] = useState("");

  // Tools
  const [selectedToolsStack, setSelectedToolsStack] = useState<string[]>([]);

  // Steps
  const [stepData, setStepData] = useState<StepData[]>([
    { title: "", description: "", demoText: "" },
  ]);

  // File upload
  const [outcomeFile, setOutcomeFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // UI state
  const [rotate, setRotate] = useState(false);
  const [preview, setPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // ─── Derived values ─────────────────────────────────────────────────────────

  const filledCount = [
    title.trim(),
    role,
    setupTime.trim(),
    description.trim(),
    selectedToolsStack.length > 0 ? "ok" : "",
    stepData.some((s) => s.title.trim() && s.description.trim()) ? "ok" : "",
    insight.trim(),
    outcomeFile ? "ok" : "",
  ].filter(Boolean).length;

  const currentStep = Math.max(1, Math.round((filledCount / 8) * 5));

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const addTool = useCallback(
    (tool: string) => {
      if (tool && !selectedToolsStack.includes(tool)) {
        setSelectedToolsStack((prev) => [...prev, tool]);
        setErrors((prev) => ({ ...prev, toolStack: undefined }));
      }
    },
    [selectedToolsStack]
  );

  const removeTool = useCallback((tool: string) => {
    setSelectedToolsStack((prev) => prev.filter((t) => t !== tool));
  }, []);

  const updateStep = useCallback(
    (index: number, field: keyof StepData, value: string) => {
      setStepData((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], [field]: value };
        return next;
      });
      setErrors((prev) => ({ ...prev, steps: undefined }));
    },
    []
  );

  const addStep = useCallback(() => {
    setStepData((prev) => [...prev, { title: "", description: "", demoText: "" }]);
  }, []);

  const removeStep = useCallback((index: number) => {
    setStepData((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  // ─── Validation ──────────────────────────────────────────────────────────────

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!title.trim()) errs.title = "Title is required";
    if (!role) errs.role = "Role is required";
    if (!setupTime.trim()) errs.setupTime = "Setup time is required";
    if (!description.trim()) errs.description = "Primary goal is required";
    if (selectedToolsStack.length === 0)
      errs.toolStack = "Add at least one tool";
    if (!stepData.some((s) => s.title.trim() && s.description.trim()))
      errs.steps = "At least one step with a title and description is required";
    if (!insight.trim()) errs.insight = "Insight is required";
    return errs;
  }

  // ─── Submission ──────────────────────────────────────────────────────────────

  async function handleSubmit(isDraft: boolean) {
    setSubmitError(null);

    if (!isDraft) {
      const errs = validate();
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        // Scroll to first error
        const firstEl = document.querySelector("[data-error]");
        firstEl?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    } else {
      // Draft only requires title
      if (!title.trim()) {
        setErrors({ title: "Title is required even for drafts" });
        return;
      }
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const token =
        // typeof window !== "undefined" ? localStorage.getItem("token") : null;
        process.env.NEXT_PUBLIC_ACCESS_TOKEN;

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("isDraft", String(isDraft));

      if (!isDraft) {
        formData.append("role", role);
        formData.append("setupTime", setupTime.trim());
        formData.append("description", description.trim());
        formData.append("insight", insight.trim());
        formData.append("toolStack", JSON.stringify(selectedToolsStack));
        const cleanSteps = stepData
          .filter((s) => s.title.trim() && s.description.trim())
          .map(({ title: t, description: d, demoText }) => ({
            title: t.trim(),
            description: d.trim(),
            ...(demoText.trim() ? { demoText: demoText.trim() } : {}),
          }));
        formData.append("steps", JSON.stringify(cleanSteps));
      }

      if (outcomeFile) {
        formData.append("file", outcomeFile);
      }

      const res = await fetch("/api/workflows", {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      console.log(res);

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          data?.message ??
          (data?.errors
            ? Object.values(data.errors as Record<string, string[]>)
                .flat()
                .join(", ")
            : "Something went wrong");
        setSubmitError(msg);
        return;
      }

      setSubmitSuccess(true);
      setTimeout(() => router.push("/explore"), 1500);
    } catch {
      setSubmitError("Network error — please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  const availableToolOptions = apiTools
    .map(t => t.name)
    .filter((t) => !selectedToolsStack.includes(t));

  return (
    <div className={`min-h-screen bg-background ${spaceGrotesk.variable}`}>
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
                Step {currentStep} of 5
              </p>
            </div>
            <input
              type="range"
              className="w-full h-2 accent-[#0D93F2] hover:cursor-pointer"
              min="0"
              max="5"
              value={currentStep}
              readOnly
            />
          </motion.section>

          {/* Success / Error banners */}
          <AnimatePresence>
            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="px-4 py-3 bg-green-500/20 border border-green-500/40 rounded-lg text-green-400 text-sm font-medium"
              >
                ✓ Workflow created successfully! Redirecting…
              </motion.div>
            )}
            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="px-4 py-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-400 text-sm font-medium"
              >
                {submitError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-10 pt-2"
            noValidate
          >
            {/* ── The Basics ── */}
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
              <div className="flex flex-col lg:flex-row justify-between items-start lg:gap-24 gap-4">
                {/* Title */}
                <div className="flex flex-col items-start gap-2 w-full">
                  <label htmlFor="workflow-title" className="font-medium text-sm">
                    Workflow Title
                  </label>
                  <input
                    type="text"
                    id="workflow-title"
                    name="workflow-title"
                    placeholder="e.g. Automated Content Research"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setErrors((prev) => ({ ...prev, title: undefined }));
                    }}
                    data-error={errors.title ? true : undefined}
                    className={`px-4 pb-3.5 pt-3.25 bg-[#182934] border rounded-lg w-full focus:outline-0 transition-colors ${
                      errors.title
                        ? "border-red-500 focus:border-red-500"
                        : "border-[#315168] focus:border-[#0D93F2]/60"
                    }`}
                  />
                  {errors.title && (
                    <p className="text-red-400 text-xs">{errors.title}</p>
                  )}
                </div>

                {/* Role */}
                <div className="flex flex-col gap-2 items-start w-full">
                  <label htmlFor="professional-role" className="font-medium text-sm">
                    Professional Role
                  </label>
                  <div
                    className="relative w-full"
                    onClick={() => setRotate(!rotate)}
                  >
                    <select
                      name="professional-role"
                      id="professional-role"
                      value={role}
                      onChange={(e) => {
                        setRole(e.target.value);
                        setErrors((prev) => ({ ...prev, role: undefined }));
                      }}
                      data-error={errors.role ? true : undefined}
                      className={`appearance-none px-4 pb-3.5 pt-3.25 bg-[#182934] border rounded-lg w-full pr-10 focus:outline-0 transition-colors ${
                        errors.role
                          ? "border-red-500 focus:border-red-500"
                          : "border-[#315168] focus:border-[#0D93F2]/60"
                      }`}
                    >
                      <option value="">Select professional role</option>
                      {PROFESSIONAL_ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <Image
                      src={ArrowIcon}
                      alt="dropdown arrow"
                      className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-300 ${rotate ? "rotate-180" : ""}`}
                    />
                  </div>
                  {errors.role && (
                    <p className="text-red-400 text-xs">{errors.role}</p>
                  )}
                </div>

                {/* Setup Time */}
                <div className="flex flex-col items-start gap-2 w-full">
                  <label htmlFor="setupTime" className="font-medium text-sm">
                    Estimated Setup Time
                  </label>
                  <input
                    type="text"
                    id="setupTime"
                    placeholder="e.g. 15 mins"
                    value={setupTime}
                    onChange={(e) => {
                      setSetupTime(e.target.value);
                      setErrors((prev) => ({ ...prev, setupTime: undefined }));
                    }}
                    data-error={errors.setupTime ? true : undefined}
                    className={`px-4 py-3.5 bg-[#182934] border rounded-lg w-full focus:outline-0 transition-colors ${
                      errors.setupTime
                        ? "border-red-500 focus:border-red-500"
                        : "border-[#315168] focus:border-[#0D93F2]/60"
                    }`}
                  />
                  {errors.setupTime && (
                    <p className="text-red-400 text-xs">{errors.setupTime}</p>
                  )}
                </div>
              </div>
            </motion.section>

            {/* ── The Mission ── */}
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
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setErrors((prev) => ({ ...prev, description: undefined }));
                  }}
                  data-error={errors.description ? true : undefined}
                  className={`px-4 py-3.5 bg-[#182934] border rounded-lg w-full focus:outline-0 transition-colors max-h-24 ${
                    errors.description
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#315168] focus:border-[#0D93F2]/60"
                  }`}
                />
                {errors.description && (
                  <p className="text-red-400 text-xs">{errors.description}</p>
                )}
              </div>
            </motion.section>

            {/* ── The Tools Stack ── */}
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

                <select
                  name="tools"
                  id="tool-search"
                  data-error={errors.toolStack ? true : undefined}
                  className={`appearance-none px-4 pb-3.5 pt-3.25 bg-[#182934] border pr-10 transition-colors pl-12 py-3.5 rounded-lg w-full focus:outline-0 text-[#6B7280] cursor-pointer ${
                    errors.toolStack
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#315168] focus:border-[#0D93F2]/60"
                  }`}
                  value=""
                  onChange={(e) => addTool(e.target.value)}
                >
                  <option value="" disabled>
                    Search and add tools (e.g. ChatGPT, Notion, Zapier...)
                  </option>
                  {availableToolOptions.toSorted((a, b) => a.localeCompare(b)).map((tool) => (
                    <option key={tool} value={tool}>
                      {tool}
                    </option>
                  ))}
                </select>

                {errors.toolStack && (
                  <p className="text-red-400 text-xs -mt-2">{errors.toolStack}</p>
                )}

                {selectedToolsStack.length > 0 && (
                  <div
                    className="flex flex-wrap gap-2"
                    role="list"
                    aria-label="Selected tools"
                  >
                    {selectedToolsStack.map((tool) => (
                      <motion.div
                        key={tool}
                        role="listitem"
                        className="flex gap-2 px-3 py-1.5 bg-[#0D93F2]/20 border border-[#0D93F2]/40 rounded-full items-center justify-center"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        layout
                      >
                        <Image
                          src={InsightIcon}
                          alt=""
                          aria-hidden="true"
                          className="w-4 h-4 hidden lg:block"
                        />
                        <span className="font-normal text-sm">{tool}</span>
                        <button
                          type="button"
                          aria-label={`Remove ${tool}`}
                          onClick={() => removeTool(tool)}
                          className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                        >
                          <Image
                            src={CloseIcon}
                            alt=""
                            aria-hidden="true"
                            className="w-3 h-3"
                          />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.section>

            {/* ── Step by Step Workflow ── */}
            <motion.section
              className="flex flex-col gap-6"
              variants={sectionVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#0D93F2] flex items-center gap-2">
                  <Image src={StepByStepIcon} alt="Step by Step icon" />
                  The Step by Step Workflow
                </h2>
                <motion.button
                  type="button"
                  className="flex gap-1 cursor-pointer items-center justify-center"
                  onClick={addStep}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image src={AddStepIcon} alt="Add Step icon" />
                  <span className="text-sm font-bold text-[#0D93F2]">
                    Add Step
                  </span>
                </motion.button>
              </div>

              {errors.steps && (
                <p className="text-red-400 text-xs -mt-4">{errors.steps}</p>
              )}

              <motion.ol
                className="flex flex-col gap-4 list-none p-0 m-0"
                variants={stepListVariants}
                initial="hidden"
                animate="show"
              >
                <AnimatePresence>
                  {stepData.map((step, index) => (
                    <motion.li
                      key={index}
                      variants={stepCardVariants}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      layout
                    >
                      <fieldset
                        className="border border-[#315168] p-6 ps-10 bg-[#182934] rounded-xl relative w-full hover:border-[#0D93F2]/40 transition-colors"
                      >
                        <legend className="sr-only">Step {index + 1}</legend>
                        <div className="bg-[#0D93F2] p-0.5 px-2 text-white font-bold text-sm rounded-full w-fit absolute left-0 top-4">
                          {index + 1}
                        </div>
                        <motion.button
                          type="button"
                          className="absolute right-2 top-2 cursor-pointer"
                          aria-label={`Delete step ${index + 1}`}
                          onClick={() => removeStep(index)}
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
                              value={step.title}
                              onChange={(e) =>
                                updateStep(index, "title", e.target.value)
                              }
                              className="px-3 py-1.5 bg-[#182934] border border-[#315168] rounded-lg w-full focus:outline-0 focus:border-[#0D93F2]/60 transition-colors"
                            />
                          </label>
                          <label className="flex flex-col gap-1.5">
                            <span className="sr-only">
                              Step {index + 1} description
                            </span>
                            <textarea
                              placeholder="Describe what happens in this step..."
                              value={step.description}
                              onChange={(e) =>
                                updateStep(index, "description", e.target.value)
                              }
                              className="px-3 py-1.5 bg-[#182934] border border-[#315168] rounded-lg w-full focus:outline-0 focus:border-[#0D93F2]/60 transition-colors text-white"
                            />
                          </label>
                          <label className="flex flex-col gap-1.5">
                            <span className="sr-only">
                              Example prompt for step {index + 1}
                            </span>
                            <textarea
                              placeholder="e.g. 'Summarize this article in 3 bullet points for a non-technical audience'"
                              value={step.demoText}
                              onChange={(e) =>
                                updateStep(index, "demoText", e.target.value)
                              }
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

            {/* ── The Unique Insight ── */}
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
                  value={insight}
                  onChange={(e) => {
                    setInsight(e.target.value);
                    setErrors((prev) => ({ ...prev, insight: undefined }));
                  }}
                  data-error={errors.insight ? true : undefined}
                  className={`px-4 py-3 border bg-[#101B22] rounded-lg w-full focus:outline-0 transition-colors max-h-18.5 placeholder:text-[#6B7280] ${
                    errors.insight
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#0D93F2]/30 focus:border-[#0D93F2]/60"
                  }`}
                />
                {errors.insight && (
                  <p className="text-red-400 text-xs">{errors.insight}</p>
                )}
              </div>
            </motion.section>

            {/* ── Outcome File ── */}
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
                <span className="text-sm text-[#90B2CB] group-hover:text-white transition-colors truncate">
                  {outcomeFile
                    ? outcomeFile.name
                    : "Upload a sample output, screenshot or result file"}
                </span>
                {outcomeFile && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setOutcomeFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="ml-auto shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                    aria-label="Remove file"
                  >
                    <Image src={CloseIcon} alt="" className="w-3 h-3" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf,.txt,.csv,.json,.md"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setOutcomeFile(file);
                  }}
                />
              </motion.label>
            </motion.section>

            {/* ── Submit & Preview ── */}
            <motion.div
              className="flex flex-col gap-3 w-full pt-10"
              variants={fadeUp}
              custom={0}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <div className="flex gap-4 w-full">
                <motion.button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSubmit(false)}
                  className="w-full bg-[#0D93F2] text-white py-4 font-bold text-base rounded-xl cursor-pointer border-2 border-[#0D93F2] transition-colors hover:bg-transparent hover:text-[#0D93F2] disabled:opacity-60 disabled:cursor-not-allowed text-nowrap"
                  whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  {isSubmitting ? "Publishing…" : "Publish Workflow"}
                </motion.button>
                <motion.button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSubmit(true)}
                  className="px-8 py-3.5 text-nowrap rounded-xl bg-[#182934] border border-[#315168] font-bold text-white text-base cursor-pointer hover:bg-[#1e3545] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  {isSubmitting ? "Saving…" : "Save Draft"}
                </motion.button>
                <motion.button
                  type="button"
                  className="px-8 py-3.5 text-nowrap rounded-xl bg-[#182934] border border-[#315168] font-bold text-white text-base cursor-pointer hover:bg-[#0D93F2] hover:border-[#0D93F2] transition-colors"
                  onClick={() => setPreview(!preview)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {preview ? "Hide Preview" : "Preview"}
                </motion.button>
              </div>
            </motion.div>
          </form>
        </main>

        {/* ── Live Preview Panel ── */}
        <AnimatePresence>
          {preview && (
            <motion.aside
              className="flex flex-col gap-6 lg:w-1/4 "
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
                    {role && (
                      <span className="text-[#0D93F2] text-[10px] bg-[#0D93F2]/10 px-2 py-px font-bold rounded-sm w-fit uppercase">
                        {role}
                      </span>
                    )}
                    <h2 className="text-xl font-bold">
                      {title || "Workflow Title"}
                    </h2>
                  </div>
                  <p className="text-sm text-[#90B2CB] max-w-87.5">
                    {description || "Describe the outcome of this workflow..."}
                  </p>

                  {/* Tools */}
                  {selectedToolsStack.length > 0 && (
                    <div className="py-2 px-0 flex flex-wrap items-center gap-2">
                      {selectedToolsStack.slice(0, 3).map((toolName, index) => {
                        const matchedTool = apiTools.find(t => t.name === toolName);
                        return (
                        <div key={index} className="p-2 bg-[#1E293B] rounded-lg place-content-center">
                          {matchedTool?.image ? (
                            <Image src={matchedTool.image} width={15} height={15} alt={toolName} className="max-w-4 max-h-4" />
                          ) : (
                            <Image src={InsightIcon} alt="Tool icon" />
                          )}
                        </div>
                      )})}
                      {selectedToolsStack.length > 3 && (
                        <p className="text-sm text-[#90B2CB]">
                          +{selectedToolsStack.length - 3} more
                        </p>
                      )}
                    </div>
                  )}

                  {/* Process Preview */}
                  {stepData.some((s) => s.title) && (
                    <div className="pt-4 flex flex-col gap-3 w-full">
                      <div className="flex justify-between w-full">
                        <p className="font-medium text-xs text-[#90B2CB]">
                          PROCESS PREVIEW
                        </p>
                        <p className="text-xs text-[#90B2CB]">
                          {stepData.filter((s) => s.title).length} Step
                          {stepData.filter((s) => s.title).length !== 1
                            ? "s"
                            : ""}
                        </p>
                      </div>
                      <ol className="flex flex-col gap-3 list-none p-0 m-0">
                        {stepData
                          .filter((s) => s.title)
                          .map((s, index) => (
                            <li
                              key={index}
                              className="flex gap-3 items-center"
                            >
                              <div className="w-6 h-6 shrink-0 place-content-center bg-[#0D93F2]/10 rounded-full px-2">
                                <p className="font-bold text-xs text-[#0D93F2]">
                                  {index + 1}
                                </p>
                              </div>
                              <p className="text-xs text-white/80 truncate">
                                {s.title}
                              </p>
                            </li>
                          ))}
                      </ol>
                    </div>
                  )}

                  {/* Insight Preview */}
                  {insight && (
                    <div className="bg-[#101B22]/50 p-3 flex flex-col gap-1 w-full">
                      <p className="font-medium text-xs text-[#0D93F2]">
                        INSIGHT PREVIEW
                      </p>
                      <p className="text-sm text-[#90B2CB] line-clamp-3">
                        &quot;{insight}&quot;
                      </p>
                    </div>
                  )}
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
