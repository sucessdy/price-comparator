import React from "react";
import FloatingRenderCard from "./FloatingRenderCard";

const FloatingCardsLayer: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
      {/* Headphones — top left */}
      <FloatingRenderCard
        image="/renders/headphone.png"
        label="Best price"
        value="₹2,499"
        valueClassName="text-cyan-300"
        positionClassName="left-[5%] top-[15%]"
        rotationClassName="-rotate-[8deg]"
        animationClassName="animate-float"
      />

      {/* Sneakers — top right */}
      <FloatingRenderCard
        image="/renders/shoes.png"
        label="Smart saving"
        value="Save 30%"
        valueClassName="text-pink-400"
        positionClassName="right-[5%] top-[15%]"
        rotationClassName="rotate-[8deg]"
        animationClassName="animate-float-delayed-2"
      />

      {/* Grocery basket — bottom left */}
      <FloatingRenderCard
        image="/renders/basket.png"
        label="Compare"
        value="3 stores"
        valueClassName="text-[#A78BFA]"
        positionClassName="left-[4%] bottom-[17%]"
        rotationClassName="rotate-[7deg]"
        animationClassName="animate-float-delayed"
      />

      {/* Delivery — bottom right */}
      <FloatingRenderCard
        image="/renders/box.png"
        label="Fast delivery"
        value="10 min"
        valueClassName="text-yellow-300"
        positionClassName="right-[4%] bottom-[17%]"
        rotationClassName="-rotate-[7deg]"
        animationClassName="animate-float"
      />
    </div>
  );
};

export default FloatingCardsLayer;