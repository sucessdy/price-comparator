import { useState } from "react";

const API_URL = "http://localhost:3000";

export default function App() {
  const [input, setInput] = useState("");
  const [cart, setCart] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Add item
  const addItem = () => {
    const value = input.trim().toLowerCase();

    if (!value) return;
    if (cart.includes(value)) {
      setError("Item already added");
      return;
    }

    setCart((prev) => [...prev, value]);
    setInput("");
    setError("");
  };

  // Remove item
  const removeItem = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // Optimize cart
  const optimizeCart = async () => {
    if (cart.length === 0) {
      setError("Add at least one item");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/optimize-cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: cart }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Something went wrong");
      }

      const data = await res.json();
      setResult(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
       <h1 class="text-3xl font-bold underline">
Smart Cart 
  </h1> 

      {/* INPUT */}
      <div className="m-10">
        <input
        className="bg-amber-50/90  text-gray-900 mr-2 px-4 py-4 h-10 w-60 mb-1.5 rounded-md "
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter product (milk, rice...)"
        />
        <button className="bg-indigo-600  px-3 py-3 rounded-md text-blue-50" onClick={addItem}>Add</button>
      </div>

      {/* ERROR */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* CART */}
      <h3>Cart</h3>
      {cart.length === 0 ? (
        <p>No items yet</p>
      ) : (
        <ul>
          {cart.map((item, i) => (
            <li key={i}>
              {item}{" "}
              <button onClick={() => removeItem(i)}>❌</button>
            </li>
          ))}
        </ul>
      )}

      {/* ACTION */}
      <button onClick={optimizeCart} disabled={loading}>
        {loading ? "Optimizing..." : "Optimize Cart"}
      </button>

      {/* RESULT */}
      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Result</h3>

          {/* SINGLE PLATFORM */}
          {result.singlePlatform && (
            <div>
              <p>✅ Recommended (One Platform)</p>
              <p><b>{result.singlePlatform.platform}</b></p>
              <p>Total: ₹{result.singlePlatform.totalCost}</p>
            </div>
          )}

          {/* SPLIT CART */}
          {result.splitCart && (
            <div style={{ marginTop: 10 }}>
              <p>⚡ Alternative (Split Cart)</p>

              {Object.entries(result.splitCart.items).map(
                ([name, data]) => (
                  <p key={name}>
                    {/* {name} → {data.platform || "N/A"} ₹{data.price || "-"} */}
                    {name} → 
                    {data.status === "not found" ? (
  <span style={{ color: "orange" }}>Not found</span>
) : (
  <>
    {data.platform} ₹{data.price}
  </>
)}
                  </p>
                )
              )}

              <p>Total: ₹{result.splitCart.totalCost}</p>
            </div>
          )}

          {/* MISSING */}
          {result.missing?.length > 0 && (
            <p style={{ color: "orange" }}>
              Missing: {result.missing.join(", ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}


// import HomePage from "./page/Home";

// function App() {
//   return <HomePage />;
// }

// export default App;