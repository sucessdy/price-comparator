import { Heart } from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-500">
            © 2026 Smart Cart. All prices are for demonstration purposes.
          </div>
          
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Made with</span>
            <Heart size={14} className="text-red-400 fill-red-400" />
            <span>for better shopping</span>
          </div>

          <div className="flex gap-4">
            <a href="#" className="text-slate-500 hover:text-white transition-colors">
              <FaGithub size={18} />
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors">
              <FaTwitter size={18} />
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors">
              <FaLinkedin size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}