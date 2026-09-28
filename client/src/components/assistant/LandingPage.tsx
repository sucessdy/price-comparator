
import React, { useRef } from "react";
// import { type SuggestPrompt } from "./assistant.types";
import FloatingCardsLayer from "./visuals/FloatingCardsLayer";

 
interface LandingPageProps {
  onSend: (message: string) => void;
  setInput: (value: string) => void;
  input: string;
  isLoading: boolean;
}


const examplePrompts = [
  "I need headphones under ₹3000",
  "Compare milk prices",
  "Plan groceries for a week",
  "Find best laptop deals",
];


const LandingPage: React.FC<LandingPageProps> = ({
  onSend,
  setInput,
  input,
  isLoading,
}) => {

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    const message = input.trim();

    if (!message || isLoading) return;

    onSend(message);
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);

    setTimeout(() => {
      onSend(prompt);
    }, 100);
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#09090D] px-4 font-sans text-white">
      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-32 h-[520px] w-[520px] rounded-full bg-[#6C63FF]/15 blur-[130px]" />

        <div className="absolute -bottom-40 -right-32 h-[520px] w-[520px] rounded-full bg-[#FF6B9D]/12 blur-[130px]" />

        <div className="absolute right-[15%] top-[20%] h-[260px] w-[260px] rounded-full bg-[#00D2FF]/5 blur-[100px]" />

        <div className="absolute left-1/2 top-[34%] h-[420px] w-[650px] -translate-x-1/2 rounded-full bg-[#6C63FF]/[0.035] blur-[100px]" />
      </div>

      {/* =========================================================
          NAVBAR
      ========================================================= */}

      <nav className="relative z-50 flex w-full items-center justify-between px-2 py-5 md:px-4 lg:px-8">
        {/* Brand */}
        <button
          type="button"
          onClick={focusInput}
          className="flex items-center gap-2"
        >
          <span className="text-2xl drop-shadow-[0_5px_12px_rgba(255,255,255,0.15)]">
            🛒
          </span>

          <span className="text-xl font-bold tracking-tight">
            Smart
            <span className="text-[#8B83FF]">Cart</span>
          </span>
        </button>

        {/* Navigation */}
        <div className="hidden items-center gap-8 text-sm text-white/45 md:flex">
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("quick-actions")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="transition-colors hover:text-white"
          >
            How it works
          </button>

          <button
            type="button"
            onClick={() =>
              document
                .getElementById("trust-bar")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="transition-colors hover:text-white"
          >
            Features
          </button>

          <button
            type="button"
            onClick={() =>
              document
                .getElementById("examples")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="transition-colors hover:text-white"
          >
            Examples
          </button>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={focusInput}
          className="rounded-full bg-[#6C63FF] px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_25px_rgba(108,99,255,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#756DFF] hover:shadow-[0_0_30px_rgba(108,99,255,0.35)]"
        >
  Try SmartCart →
        </button>
      </nav>

      {/* =========================================================
          FLOATING 3D PRODUCT CARDS
      ========================================================= */}

   <FloatingCardsLayer />
      {/* =========================================================
          MAIN HERO
      ========================================================= */}

      <main className="relative z-20 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center pt-8 text-center md:pt-12 lg:pt-10">
        <div className="mb-7 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-medium text-white/65 backdrop-blur-xl">

       
          <span>⭐</span>
          <span>Compare</span>
          <span className="text-white/25">•</span>
          <span>Plan</span>
          <span className="text-white/25">•</span>
          <span>Save</span>
        </div>

        <h1 className="text-7xl font-extrabold tracking-tight md:text-7xl lg:text-[76px]">
          Smart
          <span className="bg-gradient-to-r from-[#8B83FF] via-[#B779FF] to-[#FF6B9D] bg-clip-text text-transparent">
            Cart
          </span>
        </h1>

        <div className="mt-5 max-w-3xl text-lg font-light leading-relaxed text-white/55 md:text-xl">
          Your AI shopping assistant.
          <p className="text-white/75">
            {" "}
            Find the best products, compare prices across platforms, optimize
            your cart and save more.
          </p>
        </div> 




        {/* =========================================================
            SEARCH
        ========================================================= */}

        <div className="mt-9 w-full max-w-3xl">
          <div className="group relative">
            <div className="group-focus-within:opacity-100  absolute -inset-0.5
        rounded-[30px]
        bg-linear-to-r
        from-[#6C63FF]/50
        via-[#8B83FF]/30
        to-[#FF6B9D]/35
        opacity-50
        blur-md
        transition-all duration-500
        group-focus-within:opacity-90"  />

            <div className="relative flex items-center rounded-[26px] border border-white/10 bg-[#15151C]/95 p-2 shadow-[0_25px_70px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all duration-300 group-focus-within:border-[#7D73FF]/40">
              <div className="pl-4 text-2xl text-[#9B91FF]">✨</div>

              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder="What are you shopping for?"
                className="w-full bg-transparent px-4 py-5 text-lg text-white outline-none placeholder:text-white/30"
                disabled={isLoading}
              />

              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="flex shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-r from-[#6C63FF] to-[#827AFF] px-6 py-3.5 font-medium text-white shadow-[0_8px_25px_rgba(108,99,255,0.20)] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(108,99,255,0.30)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isLoading ? (
                  <svg
                    className="h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />

                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <>
                    Ask AI
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div> 

{/* =========================================================
    PRIMARY SEARCH CTA
========================================================= */}
{/* 
<div className="w-full max-w-3xl">
  <div className="group relative">
    <div
      className="
        absolute -inset-0.5
        rounded-[30px]
        bg-linear-to-r
        from-[#6C63FF]/50
        via-[#8B83FF]/30
        to-[#FF6B9D]/35
        opacity-50
        blur-md
        transition-all duration-500
        group-focus-within:opacity-90
      "
    />

    <div
      className="
        relative
        flex items-center
        rounded-[28px]
        border border-white/[0.14]
        bg-[#15151D]
        px-3 py-3
        shadow-[0_20px_60px_rgba(0,0,0,0.45)]
        transition-all duration-300
        group-focus-within:border-[#8B83FF]/60
        group-focus-within:shadow-[0_0_45px_rgba(108,99,255,0.18)]
      "
    >
      <div
        className="
          flex h-14 w-14 shrink-0
          items-center justify-center
          rounded-2xl
          bg-gradient-to-br
          from-[#6C63FF]/15
          to-[#FF6B9D]/10
          text-3xl
          text-[#A99FFF]
        "
      >
        ✨
      </div>

      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }}
        placeholder="What are you shopping for?"
        className="
          min-w-0 flex-1
          bg-transparent
          px-5
          py-5
          text-xl
          font-semibold
          tracking-tight
          text-white
          outline-none
          placeholder:text-white/35
          placeholder:font-medium
        "
        disabled={isLoading}
      />

      <button
        type="button"
        onClick={handleSend}
        disabled={!input.trim() || isLoading}
        className="
          flex shrink-0
          items-center gap-3
          rounded-[22px]
          bg-gradient-to-r
          from-[#6C63FF]
          to-[#816FFF]
          px-7 py-4
          text-base
          font-bold
          text-white
          shadow-[0_10px_30px_rgba(108,99,255,0.28)]
          transition-all duration-300
          hover:-translate-y-0.5
          hover:shadow-[0_14px_35px_rgba(108,99,255,0.40)]
          active:translate-y-0
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        {isLoading ? (
          <svg
            className="h-5 w-5 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <>
            <span>Ask AI</span>
            <span className="text-lg">→</span>
          </>
        )}
      </button>
    </div>
  </div>
</div>
         */}

        {/* =========================================================
            EXAMPLES
        ========================================================= */}

        <div
          id="examples"
          className="mt-5 flex max-w-4xl flex-wrap justify-center gap-2"
        >
          {examplePrompts.map((prompt) => (
            <button
              type="button"
              key={prompt}
              onClick={() => handlePromptClick(prompt)}
              disabled={isLoading}
              className="rounded-full border border-white/10 bg-white/[0.025] px-4 py-2 text-xs text-white/45 transition-all duration-200 hover:border-[#7D73FF]/35 hover:bg-[#6C63FF]/10 hover:text-white/75 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {prompt}
            </button>
          ))}
        </div>


        {/* =========================================================
            TRUST / FEATURE BAR
        ========================================================= */}

        <section
          id="trust-bar"
          className="mt-14 w-full max-w-5xl border-t border-white/[0.07] pb-12 pt-7"
        >
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#6C63FF]/20 bg-[#6C63FF]/10 text-sm text-[#9B91FF]">
                ⚡
              </div>

              <div className="text-left">
                <p className="text-sm font-medium text-white/85">
                  Live prices
                </p>
                <p className="text-xs text-white/30">
                  Across multiple platforms
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 md:justify-start">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-pink-400/20 bg-pink-400/10 text-sm text-pink-300">
                %
              </div>

              <div className="text-left">
                <p className="text-sm font-medium text-white/85">
                  Smarter cart
                </p>
                <p className="text-xs text-white/30">
                  Find the best combination
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 md:justify-start">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-sm text-cyan-300">
                🛡️
              </div>

              <div className="text-left">
                <p className="text-sm font-medium text-white/85">
                  Save more
                </p>
                <p className="text-xs text-white/30">
                  Compare & optimize
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 md:justify-start">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-yellow-400/20 bg-yellow-400/10 text-sm text-yellow-300">
                🛍️
              </div>

              <div className="text-left">
                <p className="text-sm font-medium text-white/85">
                  Multiple stores
                </p>
                <p className="text-xs text-white/30">
                  Amazon, Flipkart, Zepto & more
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;



