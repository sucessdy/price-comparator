const CartList = ({
  cart,
  removeItem
}) => {
  if (cart.length === 0) {
    return <p>No items added</p>;
  }

  return (
    <ul>
      {cart.map((item, index) => (
        <li key={index}>
          {item}

          <button
            onClick={() => removeItem(index)}
          >
            ❌
          </button>
        </li>
      ))}
    </ul>
  );
};

export default CartList;