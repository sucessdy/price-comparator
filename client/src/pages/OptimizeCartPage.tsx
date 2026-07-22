import { useState } from "react";
import { Plus, Minus, Trash2, ShoppingCart, Sparkles } from "lucide-react";
import { optimizeCart } from "../api/productApi";
import type { CartItem, OptimizeCartResponse } from "../types/product";
import OptimizationResultCard from "../components/OptimizationResultCard";

const OptimizeCartPage = () => {
  const [input, setInput] = useState<string>("");
  const [products, setProducts] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<OptimizeCartResponse | null>(null);

  const handleAddProduct = (): void => {
    if (!input.trim()) return;
    const trimmed = input.trim().toLowerCase();

    const existingProduct = products.find(
      (product) => product.name === trimmed,
    );

    if (existingProduct) {
      setProducts(
        products.map((product) =>
          product.name === trimmed
            ? { ...product, quantity: product.quantity + 1 }
            : product,
        ),
      );
    } else {
      setProducts([...products, { name: trimmed, quantity: 1 }]);
    }
    setInput("");
  };

  const handleRemoveProduct = (productToRemove: string): void => {
    setProducts(products.filter((product) => product.name !== productToRemove));
    setResult(null);
  };

  const increaseQuantity = (productName: string): void => {
    setProducts(
      products.map((product) =>
        product.name === productName
          ? { ...product, quantity: product.quantity + 1 }
          : product,
      ),
    );
    setResult(null);
  };

  const decreaseQuantity = (productName: string): void => {
    setProducts(
      products
        .map((product) =>
          product.name === productName
            ? { ...product, quantity: product.quantity - 1 }
            : product,
        )
        .filter((product) => product.quantity > 0),
    );
    setResult(null);
  };

  const totalItems = products.reduce(
    (sum: number, product: CartItem) => sum + product.quantity,
    0,
  );

  const handleOptimizeCart = async (): Promise<void> => {
    if (products.length === 0) return;

    setLoading(true);
    try {
      const response = await optimizeCart(products);

      console.log(response);

      // Handle both response structures
      const optimizationData = response.data;

      if (optimizationData && "recommended" in optimizationData) {
        setResult(optimizationData as OptimizeCartResponse);
      }
    } catch (err) {
      console.error("Optimization failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
            <ShoppingCart size={18} className="text-purple-400" />
            <span className="text-sm text-slate-300">Smart Cart Optimizer</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
            Smart Cart
          </h1>
          <p className="text-slate-400 text-lg">
            Add products and we'll find the cheapest shopping strategy
          </p>
        </div>

        {/* Add Product Section */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/10">
          <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
            <div className="flex-grow">
              <input
                value={input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setInput(e.target.value)
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                  e.key === "Enter" && handleAddProduct()
                }
                placeholder="Enter product name (e.g., milk, bread, eggs)"
                className="w-full rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-white placeholder:text-slate-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                autoFocus
              />
            </div>
            <button
              onClick={handleAddProduct}
              className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-xl text-white/95 font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add
            </button>
          </div>
        </div>

        {/* Cart Items Section */}
        {products.length > 0 ? (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden mb-8">
            <div className="p-6 border-b border-white/10">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">
                  Your Cart ({totalItems} {totalItems === 1 ? "Item" : "Items"})
                </h2>
                {products.length > 1 && (
                  <button
                    onClick={() => {
                      setProducts([]);
                      setResult(null);
                    }}
                    className="text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            <div className="divide-y divide-white/10">
              {products.map((product: CartItem) => (
                <div
                  key={product.name}
                  className="p-5 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex-grow">
                      <h3 className="text-white font-medium text-lg capitalize">
                        {product.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => decreaseQuantity(product.name)}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                      >
                        <Minus size={18} />
                      </button>

                      <span className="font-mono font-bold text-white min-w-[40px] text-center">
                        {product.quantity}
                      </span>

                      <button
                        onClick={() => increaseQuantity(product.name)}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveProduct(product.name)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all flex items-center gap-1"
                    >
                      <Trash2 size={18} />
                      <span className="hidden sm:inline text-sm">Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-12 text-center border border-white/10 mb-8">
            <div className="bg-purple-500/20 rounded-full p-4 w-fit mx-auto mb-4">
              <ShoppingCart size={48} className="text-purple-400" />
            </div>
            <p className="text-slate-400 text-lg mb-2">Your cart is empty</p>
            <p className="text-sm text-slate-500">
              Add products above to start optimizing
            </p>
          </div>
        )}

        {/* Optimize Cart Button */}
        {products.length > 0 && (
          <button
            onClick={handleOptimizeCart}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 text-white/95 disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                Optimizing...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Optimize Cart
              </>
            )}
          </button>
        )}
        
        {result && (
          <OptimizationResultCard result={result} cartItems={products} savings={0} />
        )}
      </div>
    </main>
  );
};

export default OptimizeCartPage;
