import { useState } from "react";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";
import { compareProduct } from "../api/productApi";
import type { ProductComparison } from "../types/product";
import Navbar from "../components/Navbar";
import RecentSearches from "../components/RecentSearches";
import OptimizeCartPage from "./OptimizeCartPage";
import AssistantHero from "../components/assistant/AssistantHero";

export default function HomePage() {
  const [error , setError] = useState("")
const [result, setResult] =
  useState<ProductComparison | null>(() => {
    const saved =
      localStorage.getItem("lastSearch");

    return saved
      ? JSON.parse(saved)
      : null;
  });

const [productName, setProductName] =
  useState(() => {
    const saved =
      localStorage.getItem("lastSearch");

    if (!saved) return "";

    try {
      return JSON.parse(saved).product || "";
    } catch {
      return "";
    }
  });

  const [loading, setLoading] = useState(false);

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const searches = localStorage.getItem("recentSearches");

      if (!searches) return [];

      const parsed = JSON.parse(searches);

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const saveRecentSearch = (product: string) => {
    const updated = [
      product,
      ...recentSearches.filter((s) => s !== product),
    ].slice(0, 5); // remove dupliates 
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

const handleSearch = async () => {
  if (!productName.trim()) return;

  setLoading(true);
  setError("");

  try {
    const response =
      await compareProduct(productName);

    setResult(response.data);

    localStorage.setItem(
      "lastSearch",
      JSON.stringify(response.data)
    );

    saveRecentSearch(productName);

  } catch (error) {
    
  console.error(error);
    setResult(null);

    setError("Product not found");

    localStorage.removeItem(
      "lastSearch"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen  from-slate-900 via-purple-900 to-slate-900">
      {/* <Navbar /> */}
      <AssistantHero />
      
      {/* <Hero /> */}
{/* 
      <SearchBar
        value={productName}
        onChange={setProductName}
        onSearch={handleSearch}
        loading={loading}
      /> */}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
        </div>
      ) : (
        <div className="container mx-auto px-4 pb-20">
          {result && <ProductCard result={result} />}
          {!result && <RecentSearches onSelect={setProductName} />}
        </div>
      )}
      {error && <div className="text-red-400 text-center mt-6">{error}</div>}

      {/* <OptimizeCartPage/> */}
    </main>
  );
}
