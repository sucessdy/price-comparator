const OptimizeButton = ({
  loading,
  optimizeCart
}) => {
  return (
    <button
      onClick={optimizeCart}
      disabled={loading}
    >
      {loading
        ? "Optimizing..."
        : "Optimize Cart"}
    </button>
  );
};

export default OptimizeButton;