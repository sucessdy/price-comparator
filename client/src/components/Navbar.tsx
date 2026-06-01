import { ShoppingCart, TrendingUp, Info } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-gray-900 border-b border-white/10">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="text-purple-400" size={28} />
          <h1 className="text-2xl font-bold from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Smart Cart
          </h1>
        </div>
        
        <div className="flex gap-8">
          <a href="#" className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors">
            <TrendingUp size={18} />
            Compare
          </a>
          <a href="#" className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors">
            <Info size={18} />
            About
          </a>
        </div>
      </div>
    </nav>
  );
}