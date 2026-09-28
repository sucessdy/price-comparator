import React from "react";

export interface FloatingRenderCardProps {
  image: string;
  label: string;
  value: string;
  valueClassName: string;
  positionClassName: string;
  rotationClassName: string;
  animationClassName: string;
}

const FloatingRenderCard: React.FC<FloatingRenderCardProps> = ({
  image,
  label,
  value,
  valueClassName,
  positionClassName,
  rotationClassName,
  animationClassName,
}) => {
  return (
    <div
      className={`absolute ${positionClassName} ${animationClassName} pointer-events-none`}
    >
      <div
        className={`relative h-[185px] w-[155px] [perspective:1000px] ${rotationClassName}`}
      >
        {/* Ambient glow */}
        <div className="absolute -inset-8 rounded-full bg-[#8B83FF]/20 blur-3xl" />

        {/* Back rhombus layer */}
        <div
          className="
            absolute inset-[-8px]
            rounded-[34px]
            border border-[#A78BFA]/20
            bg-gradient-to-br
            from-[#8B83FF]/20
            via-[#6C63FF]/8
            to-[#FF6B9D]/10
            shadow-[0_30px_80px_rgba(0,0,0,0.45)]
            [transform:rotate(-7deg)_skewX(-5deg)]
          "
        />

        {/* Inner glass panel */}
        <div
          className="
            absolute inset-0
            overflow-hidden
            rounded-[30px]
            border border-white/[0.14]
            bg-gradient-to-br
            from-white/[0.12]
            via-[#171722]/90
            to-[#0E0E16]/95
            backdrop-blur-2xl
            shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_25px_70px_rgba(0,0,0,0.5)]
          "
        >
          {/* Diagonal lighting */}
          <div className="absolute -right-10 -top-16 h-36 w-28 rotate-[28deg] bg-gradient-to-b from-white/20 to-transparent blur-2xl" />

          {/* Purple inner glow */}
          <div className="absolute left-1/2 top-1/3 h-24 w-24 -translate-x-1/2 rounded-full bg-[#8B83FF]/20 blur-3xl" />

          {/* Product stage */}
          <div className="absolute inset-x-3 top-3 bottom-[48px] flex items-center justify-center rounded-[24px] border border-white/[0.07] bg-gradient-to-br from-[#252536]/80 via-[#171722]/70 to-[#101018]/80">
            {/* Product shadow */}
            <div className="absolute bottom-3 left-1/2 h-4 w-20 -translate-x-1/2 rounded-full bg-black/50 blur-md" />

            {/* 3D Product */}
            <img
              src={image}
              alt=""
              className="
                relative z-10
                h-[125px] w-[125px]
                object-contain
                drop-shadow-[0_22px_18px_rgba(0,0,0,0.55)]
                transition-transform duration-500
              "
            />
          </div>

          {/* Bottom information */}
          <div className="absolute bottom-3 left-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">
              {label}
            </p>

            <p className={`mt-1 text-sm font-bold ${valueClassName}`}>
              {value}
            </p>
          </div>

          {/* Glass highlight */}
          <div className="absolute left-8 right-8 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default FloatingRenderCard;