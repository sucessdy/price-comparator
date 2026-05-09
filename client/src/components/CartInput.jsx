const CartInput = ({
  input,
  setInput,
  addItem
}) => {
  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter product"
      />

      <button onClick={addItem}>
        Add
      </button>
    </div>
  );
};

export default CartInput;