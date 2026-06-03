import { useState } from "react";
type CartItem = {
  name: string;
  quantity: number;
};

const OptimizeCartPage = () => {
  const [input, setInput] = useState("");
const [products, setProducts] =
  useState<CartItem[]>([]);
  const handleAddProduct = () => {
    if (!input) return ;
    const trimmed = input.trim().toLowerCase() ; 
    if (!trimmed) return; 
const existingProduct =
  products.find(
    (product) =>
      product.name === trimmed
  );

if (existingProduct) {

  setProducts(
    products.map((product) =>
      product.name === trimmed
        ? {
            ...product,
            quantity:
              product.quantity + 1,
          }
        : product
    )
  );

} else {

  setProducts([
    ...products,
    {
      name: trimmed,
      quantity: 1,
    },
  ]);
}
setInput("") ; 
  }
  const handleRemoveProduct = (productToRemove: string) => {
    setProducts(products.filter((product) => product.name !== productToRemove));
  };

return (
  <main className="min-h-screen p-10">

    <h1 className="text-4xl font-bold mb-8">
      Smart Cart
    </h1>

    <div className="flex gap-4">

      <input
        value={input}
        onChange={(e) =>
          setInput(e.target.value)
        }
        onKeyDown={(e) => {if(e.key === "Enter") {
            handleAddProduct() ; 
        }} }
        placeholder="Add Product"
        className="border p-3 rounded"
      />

      <button
        onClick={handleAddProduct}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add
      </button>

    </div>

    <div className="mt-8">

      {products.map((product) => (

        <div
          key={product.name}
          className="flex gap-4 mb-3"
        >

         <span>
  {product.name} × {product.quantity}
</span>

          <button
            onClick={() =>
              handleRemoveProduct(
                product.name
              )
            }
          >
            Remove
          </button>

        </div>

      ))}

    </div>

    <button
      className="mt-10 bg-green-500 text-white px-6 py-3 rounded"
    >
      Optimize Cart
    </button>

  </main>
);
};

export default OptimizeCartPage;
