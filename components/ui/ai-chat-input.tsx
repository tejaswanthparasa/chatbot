"use client" 

import * as React from "react"
import { useState, useEffect, useRef, FormEvent } from "react";
import { Mic, Paperclip, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
 
const PLACEHOLDERS = [
  "Generate website with HextaUI",
  "Create a new project with Next.js",
  "What is the meaning of life?",
  "What is the best way to learn React?",
  "How to cook a delicious meal?",
  "Summarize this article",
];

interface AIChatInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onFileUpload?: (files: FileList) => void;
  placeholder?: string;
  disabled?: boolean;
}
 
const AIChatInput = ({ 
  value: controlledValue, 
  onChange, 
  onSubmit, 
  onFileUpload,
  placeholder, 
  disabled = false 
}: AIChatInputProps) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [inputValue, setInputValue] = useState(controlledValue || "");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with controlled value
  useEffect(() => {
    if (controlledValue !== undefined) {
      setInputValue(controlledValue);
    }
  }, [controlledValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
  };

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || disabled) return;
    onSubmit?.(inputValue.trim());
    if (controlledValue === undefined) {
      setInputValue("");
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload?.(files);
      // Reset the input so the same file can be selected again
      e.target.value = '';
    }
  };
 
  // Cycle placeholder text when input is inactive
  useEffect(() => {
    if (isActive || inputValue) return;
 
    const interval = setInterval(() => {
      setShowPlaceholder(false);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        setShowPlaceholder(true);
      }, 400);
    }, 3000);
 
    return () => clearInterval(interval);
  }, [isActive, inputValue]);
 
  // Close input when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        if (!inputValue) setIsActive(false);
      }
    };
 
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inputValue]);
 
  const handleActivate = () => setIsActive(true);
 
  const containerVariants = {
    inactive: {
      boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
      transition: { type: "spring" as const, stiffness: 120, damping: 18 },
    },
    active: {
      boxShadow: "0 8px 32px 0 rgba(0,0,0,0.16)",
      transition: { type: "spring" as const, stiffness: 120, damping: 18 },
    },
  };
 
  const placeholderContainerVariants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.025 } },
    exit: { transition: { staggerChildren: 0.015, staggerDirection: -1 } },
  };
 
  const letterVariants = {
    initial: {
      opacity: 0,
      filter: "blur(12px)",
      y: 10,
    },
    animate: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        opacity: { duration: 0.25 },
        filter: { duration: 0.4 },
        y: { type: "spring" as const, stiffness: 80, damping: 20 },
      },
    },
    exit: {
      opacity: 0,
      filter: "blur(12px)",
      y: -10,
      transition: {
        opacity: { duration: 0.2 },
        filter: { duration: 0.3 },
        y: { type: "spring" as const, stiffness: 80, damping: 20 },
      },
    },
  };
 
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept="*/*"
      />
      <motion.div
        ref={wrapperRef}
        className="w-full max-w-3xl mx-auto"
        variants={containerVariants}
        animate={isActive || inputValue ? "active" : "inactive"}
        initial="inactive"
        style={{ overflow: "hidden", borderRadius: 32, background: "#fff" }}
        onClick={handleActivate}
      >
        <div className="flex flex-col items-stretch w-full h-full">
          {/* Input Row */}
          <div className="flex items-center gap-2 p-1 rounded-full bg-white max-w-3xl w-full">
            <button
              className="p-3 rounded-full hover:bg-gray-100 transition"
              title="Attach file"
              type="button"
              tabIndex={-1}
              onClick={handleFileUpload}
              disabled={disabled}
            >
              <Paperclip size={20} />
            </button>
 
            {/* Text Input & Placeholder */}
            <div className="relative flex-1">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="flex-1 border-0 outline-0 rounded-md py-2 text-base bg-transparent w-full font-normal"
                style={{ position: "relative", zIndex: 1 }}
                onFocus={handleActivate}
                disabled={disabled}
                placeholder={placeholder}
              />
              <div className="absolute left-0 top-0 w-full h-full pointer-events-none flex items-center px-3 py-2">
                <AnimatePresence mode="wait">
                  {showPlaceholder && !isActive && !inputValue && (
                    <motion.span
                      key={placeholderIndex}
                      className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 select-none pointer-events-none"
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        zIndex: 0,
                      }}
                      variants={placeholderContainerVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      {PLACEHOLDERS[placeholderIndex]
                        .split("")
                        .map((char, i) => (
                          <motion.span
                            key={i}
                            variants={letterVariants}
                            style={{ display: "inline-block" }}
                          >
                            {char === " " ? "\u00A0" : char}
                          </motion.span>
                        ))}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
 
            <button
              className="p-3 rounded-full hover:bg-gray-100 transition"
              title="Voice input"
              type="button"
              tabIndex={-1}
            >
              <Mic size={20} />
            </button>
            <button
              className="flex items-center gap-1 bg-black hover:bg-zinc-700 text-white p-3 rounded-full font-medium justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              title="Send"
              type="submit"
              disabled={disabled || !inputValue.trim()}
              tabIndex={-1}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </form>
  );
};
 
export { AIChatInput };