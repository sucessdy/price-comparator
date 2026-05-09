const RecommendationCard = ({
  recommendation
}) => {
  if (!recommendation) return null;

  return (
    <div>
      <h2>✅ Recommended</h2>

      <p>
        Buy from:
        <strong>
          {recommendation.platform}
        </strong>
      </p>

      <p>
        Total:
        ₹{recommendation.totalCost}
      </p>
    </div>
  );
};

export default RecommendationCard;