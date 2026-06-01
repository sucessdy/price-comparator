import { Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="text-center pt-20 pb-16 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ] bg-purple-500/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
          <Sparkles size={18} className="text-yellow-400" />
          <span className="text-sm text-slate-300">AI-Powered Price Comparison</span>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-bold  from-white via-purple-200 to-pink-200 bg-clip-text text-transparent animate-fade-in">
          Smart Cart
        </h1>
        
        <p className="mt-6  justify-center items-center  text-slate-300 text-xl  mx-auto text-center   ">
          Compare prices across  <span className="text-purple-400 font-semibold "> 10+ platforms</span> and save up to 40% on your purchases
        </p>
      </div>
    </section>
  );
}