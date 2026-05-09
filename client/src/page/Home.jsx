// import { useState } from "react";

// import Header from "../components/Header";
// import CartInput from "../components/CartInput";
// import CartList from "../components/CartList";
// import OptimizeButton from "../components/OptimizeButton";
// import RecommendationCard from "../components/RecommendationCard";
// import SavingsCard from "../components/SavingsCard";
// import MissingItems from "../components/MissingItems";
// import ErrorMessage from "../components/ErrorMessage";

// const HomePage = () => {
//   const [input, setInput] = useState("");
//   const [cart, setCart] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [result, setResult] = useState(null);

//   // Add item
//   const addItem = () => {
//     const value = input.trim().toLowerCase();

//     if (!value) return;

//     setCart((prev) => [...prev, value]);
//     setInput("");
//   };

//   // Remove item
//   const removeItem = (index) => {
//     setCart((prev) =>
//       prev.filter((_, i) => i !== index)
//     );
//   };

//   // Optimize cart
//   const optimizeCart = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch(
//         "http://localhost:3000/optimize-cart",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type":
//               "application/json",
//           },
//           body: JSON.stringify({
//             products: cart,
//           }),
//         }
//       );

//       const data = await res.json();

//       setResult(data);

//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <Header />

//       <CartInput
//         input={input}
//         setInput={setInput}
//         addItem={addItem}
//       />

//       <CartList
//         cart={cart}
//         removeItem={removeItem}
//       />

//       <OptimizeButton
//         loading={loading}
//         optimizeCart={optimizeCart}
//       />

//       <ErrorMessage error={error} />

//       <RecommendationCard
//         recommendation={
//           result?.singlePlatform
//         }
//       />

//       <SavingsCard
//         alternative={
//           result?.alternative
//         }
//       />

//       <MissingItems
//         missing={result?.missing}
//       />
//     </div>
//   );
// };

// export default HomePage;