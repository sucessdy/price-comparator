const SavingsCard = ({
  alternative
}) => {
  if (!alternative) return null;

  return (
    <div>
      <h3>⚡ Save More</h3>

      <p>
        Save ₹{alternative.savings}
      </p>
    </div>
  );
};

export default SavingsCard;